// server/api/payments/checkout.post.ts
import Stripe from 'stripe'
import { defineEventHandler, readBody } from 'h3'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as any
})

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    cart: Array<{ id: string; name: string; price: number; quantity: number }>
    email: string
    orderId: string
  }>(event)

  const items = body.cart || []

  const line_items = items.map((item) => ({
    price_data: {
      currency: 'eur',
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items,
    // on met aussi orderId dans l'URL pour affichage rapide côté client
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${body.orderId}`,
    cancel_url: `${baseUrl}/cancel`,
    client_reference_id: body.orderId, // pratique pour support
    metadata: {
      email: body.email || '',
      orderId: body.orderId,           // <-- important pour le webhook
    },
  })

  return { url: session.url }
})
