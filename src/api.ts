const BASE_URL = (import.meta.env.VITE_API_URL || '') + '/api/v1';

class ApiError extends Error {
  constructor(public status: number, public data: any) {
    super(data?.error?.message || data?.message || 'API request failed');
  }
}

let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

function processQueue(error: any, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  pendingQueue = [];
}

async function attemptTokenRefresh(): Promise<string> {
  const refreshToken = localStorage.getItem('zenvy_refresh_token');
  if (!refreshToken) throw new Error('No refresh token');

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) throw new Error('Refresh failed');

  const data = await response.json();
  const result = data?.data ?? data;

  localStorage.setItem('zenvy_token', result.accessToken);
  localStorage.setItem('zenvy_refresh_token', result.refreshToken);

  return result.accessToken;
}

export const apiClient = {
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('zenvy_token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

    // Auto-refresh on 401 (except for auth endpoints themselves)
    if (
      response.status === 401 &&
      !endpoint.startsWith('/auth/login') &&
      !endpoint.startsWith('/auth/register') &&
      !endpoint.startsWith('/auth/refresh')
    ) {
      try {
        let newToken: string;

        if (isRefreshing) {
          // Wait for the in-progress refresh
          newToken = await new Promise<string>((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
          });
        } else {
          isRefreshing = true;
          try {
            newToken = await attemptTokenRefresh();
            processQueue(null, newToken);
          } catch (refreshErr) {
            processQueue(refreshErr, null);
            throw refreshErr;
          } finally {
            isRefreshing = false;
          }
        }

        // Retry original request with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
      } catch {
        // Refresh failed — clear auth and notify
        localStorage.removeItem('zenvy_token');
        localStorage.removeItem('zenvy_refresh_token');
        window.dispatchEvent(new Event('zenvy:logout'));
      }
    }

    // Still 401 after refresh attempt — force logout
    if (
      response.status === 401 &&
      !endpoint.startsWith('/auth/login') &&
      !endpoint.startsWith('/auth/register')
    ) {
      localStorage.removeItem('zenvy_token');
      localStorage.removeItem('zenvy_refresh_token');
      window.dispatchEvent(new Event('zenvy:logout'));
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new ApiError(response.status, data);
    }

    // Unwrap standard { success: true, data: T } envelope
    return data?.data !== undefined ? data.data : data;
  },

  get<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T = any>(endpoint: string, body: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  },

  patch<T = any>(endpoint: string, body: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  },

  delete<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
};
