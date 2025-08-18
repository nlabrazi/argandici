import Stripe from 'stripe'
import { readRawBody, createError } from 'h3'
import { prisma } from '~/server/prisma/client'
import { OrderStatus } from '@prisma/client'
import { sendInvoiceEmail } from '~/server/utils/mailService'
import { generateOrderInvoicePdf, uploadInvoiceToSupabase } from '~/server/utils/pdf'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as any
})

export default defineEventHandler(async (event) => {
  const sig = event.node.req.headers['stripe-signature']
  const rawBody = await readRawBody(event)
  let stripeEvent: Stripe.Event

  // 1. Vérification de la signature Stripe
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody!,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('[Stripe Webhook] Invalid signature:', err.message)
    throw createError({ statusCode: 400, statusMessage: `Webhook Error: ${err.message}` })
  }

  // 2. Réponse immédiate à Stripe
  event.node.res.statusCode = 200
  event.node.res.end(JSON.stringify({ received: true }))

  // 3. On ne traite QUE les paiements réussis
  if (stripeEvent.type !== 'checkout.session.completed') {
    return
  }

  const session = stripeEvent.data.object as Stripe.Checkout.Session
  const orderId = session.metadata?.orderId
  if (!orderId) {
    console.error('[Stripe Webhook] No orderId in session.metadata')
    return
  }

  try {
    // a. Passage commande en "PAID"
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID },
      include: { orderItems: { include: { product: true } } }
    })
    console.log(`[Stripe Webhook] Order ${orderId} set to PAID`)

    // b. Générer la facture PDF
    const pdfBuffer = await generateOrderInvoicePdf(order)
    console.log(`[Stripe Webhook] PDF generated for order ${orderId}`)

    // c. Uploader sur Supabase (optionnel)
    let pdfUrl: string | undefined
    try {
      pdfUrl = await uploadInvoiceToSupabase(orderId, pdfBuffer)
      console.log(`[Stripe Webhook] PDF uploaded: ${pdfUrl}`)
    } catch (err) {
      console.warn(`[Stripe Webhook] ⚠️ Upload PDF failed, fallback to attach only.`)
    }

    // d. Email facture (client + compta)
    if (pdfUrl) {
      await prisma.order.update({
        where: { id: orderId },
        data: { invoiceUrl: pdfUrl }
      })
    }

    // e) Envoyer l’email (client + compta), avec le PDF en pièce jointe
    const recipients = [order.email, 'compta@argandici.com'].filter(Boolean) as string[]
    for (const to of recipients) {
      await sendInvoiceEmail({ to, orderId, pdfBuffer, pdfUrl })
      console.log(`[Stripe Webhook] Email sent to ${to}`)
    }
  } catch (err: any) {
    console.error(`[Stripe Webhook] ERROR for order ${orderId}:`, err.message)
  }
})
