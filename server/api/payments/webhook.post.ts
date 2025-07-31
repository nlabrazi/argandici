import Stripe from 'stripe'
import { readRawBody, createError } from 'h3'
import { prisma } from '~/server/prisma/client'
import { sendInvoiceEmail } from '~/server/utils/mailService'
import { generateOrderInvoicePdf, uploadInvoiceToSupabase } from '~/server/utils/pdf'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export default defineEventHandler(async (event) => {
  const sig = event.node.req.headers['stripe-signature']
  const rawBody = await readRawBody(event)
  let stripeEvent

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
    console.log(`[Stripe Webhook] Ignored event type: ${stripeEvent.type}`)
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
      data: { status: 'PAID' },
      include: { items: { include: { product: true } } }
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
    const recipients = [order.email, 'compta@argandici.com'].filter(Boolean)
    for (const to of recipients) {
      await sendInvoiceEmail({
        to,
        orderId,
        pdfBuffer,
        pdfUrl,
      })
      console.log(`[Stripe Webhook] Email sent to ${to}`)
    }
  } catch (err: any) {
    console.error(`[Stripe Webhook] ERROR for order ${orderId}:`, err.message)
  }
})
