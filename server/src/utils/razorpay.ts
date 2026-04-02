import Razorpay from 'razorpay';
import crypto from 'crypto';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret123',
});

export const paymentsService = {
  async createPaymentOrder(amount: number, receiptId: string, metadata: Record<string, string>) {
    return await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert to paisa
      currency: 'INR',
      receipt: receiptId,
      notes: metadata,
    });
  },

  verifySignature(orderId: string, paymentId: string, signature: string) {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'secret123';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(orderId + '|' + paymentId)
      .digest('hex');
    
    return generatedSignature === signature;
  }
};
