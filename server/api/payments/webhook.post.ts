// server/api/payments/webhook.post.ts
import Stripe from 'stripe'
import { useRawBody, createError } from 'h3'
import { prisma } from '~/server/utils/prisma' // à adapter selon ton projet
import { sendMailgunMail } from '~/server/utils/mailgun' // à adapter à ton mailer
import { generateOrderInvoicePdf, uploadInvoiceToSupabase } from '~/server/utils/pdf' // à adapter
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export default defineEventHandler(async (event) => {
  const sig = event.node.req.headers['stripe-signature']
  const rawBody = await useRawBody(event)
  let stripeEvent

  // 1. Vérification de la signature
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

  // 2. Réponse rapide à Stripe
  event.node.res.statusCode = 200
  event.node.res.end(JSON.stringify({ received: true }))

  // 3. On ne traite que checkout.session.completed
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

  console.log(`[Stripe Webhook] Processing payment for orderId: ${orderId}`)

  try {
    // a. Passage commande en "PAID"
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
      include: { items: { include: { product: true } } }
    })
    console.log(`[Stripe Webhook] Order ${orderId} set to PAID`)

    // b. Génération du PDF de facture
    const pdfBuffer = await generateOrderInvoicePdf(order)
    console.log(`[Stripe Webhook] PDF generated for order ${orderId}`)

    // c. Upload du PDF (Supabase, S3, etc)
    const pdfUrl = await uploadInvoiceToSupabase(orderId, pdfBuffer)
    console.log(`[Stripe Webhook] PDF uploaded: ${pdfUrl}`)

    // d. Envoi email (Mailgun)
    const recipients = [order.email, 'compta@argandici.com'].filter(Boolean)
    for (const to of recipients) {
      await sendMailgunMail({
        to,
        subject: `Votre facture Argan d'ici - Commande ${orderId}`,
        text: `Merci pour votre commande ! Retrouvez votre facture ci-jointe.`,
        html: `<p>Merci pour votre commande !<br/>Vous trouverez votre facture en pièce jointe.</p>`,
        attachments: [{ filename: `facture-${orderId}.pdf`, content: pdfBuffer }]
      })
      console.log(`[Stripe Webhook] Email sent to ${to}`)
    }

  } catch (err: any) {
    console.error(`[Stripe Webhook] ERROR for order ${orderId}:`, err.message)
  }
})
