import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe | null = null;

  constructor(private config: ConfigService) { }

  private getStripe(): Stripe {
    if (!this.stripe) {
      const key = this.config.get<string>('STRIPE_SECRET_KEY');
      if (!key) throw new Error('STRIPE_SECRET_KEY is not set');

      this.stripe = new Stripe(key, {
        apiVersion: '2025-05-28.basil',
      });

      console.log('[StripeService] Stripe initialized lazily');
    }

    return this.stripe;
  }

  async createCheckoutSession(
    orderId: string,
    items: { name: string; price: number; quantity: number }[],
    customerEmail?: string,
  ): Promise<string> {
    const successUrl = this.config.get<string>('STRIPE_SUCCESS_URL');
    const cancelUrl = this.config.get<string>('STRIPE_CANCEL_URL');

    if (!successUrl || !cancelUrl) {
      throw new Error('STRIPE_SUCCESS_URL or STRIPE_CANCEL_URL not set');
    }

    const stripe = this.getStripe(); // 💡 Initialisation paresseuse

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: { orderId },
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    console.log('[StripeService] session created:', {
      id: session.id,
      metadata: session.metadata,
    });

    return session.url!;
  }
}
