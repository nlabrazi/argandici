// server/api/payments/checkout.post.ts
import Stripe from 'stripe'
import { defineEventHandler, readBody } from 'h3'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as any
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // Ex: body = { cart: [{ id, name, price, quantity }] }

  const items = body.cart || []

  // Transforme tes items en format Stripe
  const line_items = items.map((item: any) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.name,
        // Optionnel: description, images (url cloudinary possible ici)
      },
      unit_amount: Math.round(item.price * 100), // Stripe attend des centimes
    },
    quantity: item.quantity,
  }))

  // Adresse de retour après paiement
  const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items,
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart`,
    metadata: {
      // Tu peux passer l'id panier ou email, à récupérer dans le webhook
      email: body.email || '',
    }
  })

  return { url: session.url }
})
