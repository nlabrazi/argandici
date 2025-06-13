import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private stripe: Stripe | null = null;
  private domainUrl: string | null = null;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) { }

  private initStripe(): Stripe {
    if (!this.stripe) {
      const key = this.config.get<string>('STRIPE_SECRET_KEY');
      if (!key) {
        throw new Error('STRIPE_SECRET_KEY is not set');
      }

      this.stripe = new Stripe(key, {
        apiVersion: '2025-05-28.basil',
      });

      console.log('[PaymentsService] Stripe initialized lazily');
    }

    return this.stripe;
  }

  private getDomainUrl(): string {
    if (!this.domainUrl) {
      const url = this.config.get<string>('DOMAIN_URL');
      if (!url) {
        console.warn('[PaymentsService] DOMAIN_URL not set, fallback to localhost');
        this.domainUrl = 'http://localhost:4200';
      } else {
        this.domainUrl = url;
      }
    }

    return this.domainUrl;
  }

  async createCheckoutSession(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) throw new NotFoundException('Commande introuvable');
    if (order.status !== 'PENDING') {
      throw new BadRequestException('Commande déjà traitée');
    }

    const stripe = this.initStripe();
    const domain = this.getDomainUrl();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: order.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(item.product.price * 100),
          product_data: {
            name: item.product.name,
            images: [
              // `https://argandici.com/assets/${item.product.image}`,
              `https://source.unsplash.com/featured/?argan,oil`,
            ],
          },
        },
      })),
      success_url: `${domain}/order/success?orderId=${orderId}`,
      cancel_url: `${domain}/order/cancel?orderId=${orderId}`,
      metadata: {
        orderId,
      },
    });

    return { url: session.url };
  }
}
