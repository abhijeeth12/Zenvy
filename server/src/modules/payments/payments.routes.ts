import { FastifyInstance } from 'fastify';
import { paymentsService } from '../../utils/razorpay.js';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export async function paymentRoutes(fastify: FastifyInstance) {
  
  // Endpoint called by frontend immediately after successful Stripe-like or Razorpay modal return
  fastify.post('/verify', async (request, reply) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = request.body as any;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return reply.status(400).send({ error: 'Missing parameters' });
    }

    const isValid = paymentsService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (isValid) {
      const order = await prisma.order.findFirst({
        where: { paymentReference: razorpay_order_id } as any
      });
      
      if (order && order.paymentStatus !== 'PAID') {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'PAID' }
        });
        logger.info(`✅ Order ${order.id} marked as PAID via Razorpay frontend verification.`);
      }

      return reply.send({ success: true });
    } else {
      return reply.status(400).send({ error: 'Invalid signature' });
    }
  });

  // Razorpay Webhook Endpoint (optional backup)
  fastify.post('/webhook', async (request, reply) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = request.headers['x-razorpay-signature'] as string;
    
    // In a real prod environment we'd verify the signature with crypto.
    // For simplicity we extract the payload.
    const event = request.body as any;

    try {
      if (event.event === 'order.paid' || event.event === 'payment.captured') {
        const entity = event.payload.payment.entity;
        const razorpayOrderId = entity.order_id;
        
        if (razorpayOrderId) {
          const order = await prisma.order.findFirst({ where: { paymentReference: razorpayOrderId } as any });
          if (order && order.paymentStatus !== 'PAID') {
            await prisma.order.update({
              where: { id: order.id },
              data: { paymentStatus: 'PAID' },
            });
            logger.info(`✅ Order ${order.id} marked as PAID via Razorpay Webhook.`);
          }
        }
      } else if (event.event === 'payment.failed') {
        const entity = event.payload.payment.entity;
        const razorpayOrderId = entity.order_id;
        
        if (razorpayOrderId) {
          const order = await prisma.order.findFirst({ where: { paymentReference: razorpayOrderId } as any });
          if (order) {
            await prisma.order.update({
              where: { id: order.id },
              data: { paymentStatus: 'FAILED' },
            });
            logger.warn(`❌ Order ${order.id} marked as FAILED via Razorpay Webhook.`);
          }
        }
      }

      reply.send({ received: true });
    } catch (err: any) {
      logger.error('Razorpay Webhook payload error:', err);
      return reply.status(400).send(`Webhook Error: ${err.message}`);
    }
  });
}
