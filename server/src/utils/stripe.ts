import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2024-11-20.acacia' as any,
});

export const paymentsService = {
  async createPaymentIntent(amount: number, metadata: Record<string, string>) {
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata,
    });
  }
};
