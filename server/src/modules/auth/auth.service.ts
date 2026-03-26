import { prisma } from '../../config/database.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from '../../utils/token.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw { statusCode: 409, code: 'EMAIL_EXISTS', message: 'An account with this email already exists' };
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        displayName: input.displayName,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.role);

    return { user, ...tokens };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        passwordHash: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' };
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' };
    }

    const { passwordHash, ...userWithoutPassword } = user;
    const tokens = await this.generateTokens(user.id, user.role);

    return { user: userWithoutPassword, ...tokens };
  }

  async google(credential: string) {
    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw { statusCode: 400, code: 'INVALID_CREDENTIAL', message: 'Invalid Google credential' };
      }

      const { email, name = email.split('@')[0], picture, email_verified } = payload;
      if (!email_verified) {
        throw { statusCode: 400, code: 'EMAIL_NOT_VERIFIED', message: 'Google email not verified' };
      }

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        const crypto = await import('crypto');
        const dummyPassword = await hashPassword(crypto.randomBytes(16).toString('hex'));
        user = await prisma.user.create({
          data: {
            email,
            displayName: name,
            avatarUrl: picture || undefined,
            passwordHash: dummyPassword,
            isVerified: true,
          }
        });
      } else if (!user.avatarUrl && picture) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl: picture }
        });
      }

      const tokens = await this.generateTokens(user.id, user.role);
      const { passwordHash, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, ...tokens };
    } catch (error) {
      console.error('Google auth error:', error);
      throw { statusCode: 400, code: 'GOOGLE_VERIFY_FAILED', message: 'Failed to verify Google token' };
    }
  }

  async refresh(refreshTokenValue: string) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenValue },
      include: { user: { select: { id: true, role: true } } },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw { statusCode: 401, code: 'INVALID_REFRESH_TOKEN', message: 'Refresh token is invalid or expired' };
    }

    // Revoke old token (rotation)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const tokens = await this.generateTokens(storedToken.user.id, storedToken.user.role);
    return tokens;
  }

  async logout(userId: string) {
    // Revoke all refresh tokens for this user
    await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw { statusCode: 404, code: 'USER_NOT_FOUND', message: 'User not found' };
    }

    return user;
  }

  async forgotPassword(input: { email: string }) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return { message: 'If that email exists, a reset link has been sent.' };
    }

    // Generate random token
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    // In a real app, send email here. For now, log it and return it for Dev UX.
    console.log(`[AUTH] Password reset requested for ${user.email}. Token: ${resetToken}`);
    return { message: 'If that email exists, a reset link has been sent.', devToken: resetToken };
  }

  async resetPassword(input: import('./auth.schema.js').ResetPasswordInput) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: input.token,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw { statusCode: 400, code: 'INVALID_TOKEN', message: 'Password reset token is invalid or has expired' };
    }

    const newPasswordHash = await hashPassword(input.newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    // Revoke all existing refresh tokens for security
    await prisma.refreshToken.updateMany({
      where: { userId: user.id, revoked: false },
      data: { revoked: true },
    });

    return { message: 'Password has been successfully reset. Please log in with your new password.' };
  }

  private async generateTokens(userId: string, role: string) {
    const accessToken = generateAccessToken({ userId, role });
    const refreshToken = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
