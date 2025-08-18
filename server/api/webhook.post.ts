// server/api/webhook.post.ts
import Stripe from 'stripe'
import { readRawBody, createError } from 'h3'
import { prisma } from '~/server/prisma/client'
import { OrderStatus } from '@prisma/client'
import { generateOrderInvoicePdf, uploadInvoiceToSupabase } from '~/server/utils/pdf'
import { generateOrderEmailHtml } from '~/server/utils/orderEmailTemplate'
import { sendOrderEmailWithInvoice } from '~/server/utils/mailService'
import { sendTelegramMessage, buildTelegramOrderMessage } from '~/server/utils/telegram'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as any,
})

export default defineEventHandler(async (event) => {
  const sig = event.node.req.headers['stripe-signature']
  const rawBody = await readRawBody(event)
  let stripeEvent: Stripe.Event

  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody!, sig!, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('[Stripe Webhook] Invalid signature:', err.message)
    throw createError({ statusCode: 400, statusMessage: `Webhook Error: ${err.message}` })
  }

  // Réponse immédiate à Stripe
  event.node.res.statusCode = 200
  event.node.res.end(JSON.stringify({ received: true }))

  if (stripeEvent.type !== 'checkout.session.completed') return

  const session = stripeEvent.data.object as Stripe.Checkout.Session
  const orderId = session.metadata?.orderId
  if (!orderId) {
    console.error('[Stripe Webhook] No orderId in session.metadata')
    return
  }

  try {
    // 1) Charger la commande + items
    let order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: { include: { product: true } } },
    })
    if (!order) {
      console.error('[Stripe Webhook] Order not found:', orderId)
      return
    }

    // 2) Idempotence : si déjà notifié, stop
    if (order.postPaymentNotifiedAt) {
      console.log(`[Stripe Webhook] Order ${orderId} already notified, skipping.`)
      return
    }

    // 3) Passer en PAID si pas déjà
    if (order.status !== OrderStatus.PAID) {
      order = await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PAID },
        include: { orderItems: { include: { product: true } } },
      })
      console.log(`[Stripe Webhook] Order ${orderId} set to PAID`)
    }

    // 4) Préparer PDF
    const orderForPdf = {
      id: order.id,
      date: order.date,
      fullName: order.fullName,
      email: order.email,
      items: order.orderItems.map((oi) => ({
        quantity: oi.quantity,
        product: { name: oi.product.name, price: oi.unitPrice ?? oi.product.price },
      })),
      total: order.total,
    }

    let pdfBuffer: Buffer | undefined
    let pdfUrl: string | undefined

    // 5) Générer PDF + upload (si l’upload échoue, PJ seulement)
    try {
      pdfBuffer = await generateOrderInvoicePdf(orderForPdf)
      pdfUrl = await uploadInvoiceToSupabase(orderId, pdfBuffer)
      await prisma.order.update({ where: { id: orderId }, data: { invoiceUrl: pdfUrl } })
      console.log(`[Stripe Webhook] PDF uploaded: ${pdfUrl}`)
    } catch (e) {
      console.warn('[Stripe Webhook] PDF upload failed, will send as attachment only.')
    }

    // 6) Email unique (template "beau" + PJ PDF)
    try {
      const emailPayload = {
        id: order.id,
        date: order.date,
        total: order.total,
        shippingProvider: order.shippingProvider,
        trackingNumber: order.trackingNumber,
        items: order.orderItems.map((oi) => ({
          quantity: oi.quantity,
          unitPrice: oi.unitPrice ?? oi.product.price,
          product: { name: oi.product.name, image: oi.product.image, price: oi.product.price },
        })),
      }
      const html = generateOrderEmailHtml(emailPayload)
      if (order.email) {
        await sendOrderEmailWithInvoice({
          to: order.email,
          subject: `Votre commande #${order.id} — Argan d'ici`,
          html,
          pdfBuffer,
          pdfFilename: `facture-${order.id}.pdf`,
        })
      }
      // (Optionnel) copie compta :
      // await sendOrderEmailWithInvoice({ to: 'compta@argandici.com', subject: ..., html, pdfBuffer, pdfFilename: ... })
    } catch (e) {
      console.error('[Stripe Webhook] Email send error:', (e as any)?.message || e)
    }

    // 7) Telegram — un seul message
    try {
      const msg = buildTelegramOrderMessage(order as any)
      await sendTelegramMessage(msg)
    } catch (e) {
      console.error('[Stripe Webhook] Telegram error:', (e as any)?.message || e)
    }

    // 8) Marquer la notif (idempotence forte)
    await prisma.order.update({
      where: { id: orderId },
      data: { postPaymentNotifiedAt: new Date() },
    })
    console.log(`[Stripe Webhook] Order ${orderId} notifications done.`)
  } catch (err: any) {
    console.error(`[Stripe Webhook] ERROR for order ${orderId}:`, err.message)
  }
})
