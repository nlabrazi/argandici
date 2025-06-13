import {
  Controller,
  Post,
  Headers,
  Req,
  Res,
  HttpStatus,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';

@Controller('webhooks/stripe')
export class StripeWebhooksController {
  private readonly logger = new Logger(StripeWebhooksController.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private mailService: MailService,
    private pdfService: PdfService,
  ) { }

  @Post()
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!secretKey || !webhookSecret) {
      this.logger.error('STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET not set in env');
      throw new InternalServerErrorException('Stripe config missing');
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2025-05-28.basil' });

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err: any) {
      this.logger.error(`❌ Webhook signature failed: ${err.message}`);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }

    // ✅ On répond tout de suite pour Stripe
    res.status(HttpStatus.OK).json({ received: true });

    if (event.type !== 'checkout.session.completed') {
      this.logger.log(`ℹ️ Ignored event type: ${event.type}`);
      return;
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      this.logger.error('❌ checkout.session.completed without metadata.orderId');
      throw new BadRequestException('Missing orderId in Stripe session metadata');
    }

    this.logger.log(`✅ Processing checkout.session.completed for orderId: ${orderId}`);

    try {
      const order = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' },
        include: { items: { include: { product: true } } },
      });
      this.logger.log(`💰 Order ${orderId} marked as PAID`);

      const pdfBuffer = await this.pdfService.generateInvoicePdf(order);
      this.logger.log(`🧾 PDF generated for order ${orderId}`);

      const pdfUrl = await this.pdfService.uploadInvoiceToSupabase(orderId, pdfBuffer);
      this.logger.log(`📤 PDF uploaded to Supabase: ${pdfUrl}`);

      const recipients = [order.email!, 'compta@argandici.com'].filter(Boolean);
      this.logger.log(`👥 Sending invoice to: ${recipients.join(', ')}`);

      for (const to of recipients) {
        this.logger.log(`✉️ Sending invoice to ${to}`);
        await this.mailService.sendPdfInvoice(to, pdfUrl, orderId);
      }

      this.logger.log('🎉 All invoice emails sent');

    } catch (err: any) {
      this.logger.error(`❌ Failed to process invoice for ${orderId}: ${err.message}`);
    }
  }
}
