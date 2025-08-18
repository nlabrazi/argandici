import Stripe from 'stripe'
import { prisma } from '~/server/prisma/client'
import { createError } from 'h3'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as any,
})

export default defineEventHandler(async (event) => {
  const { public: { siteUrl } } = useRuntimeConfig(event)
  const body = await readBody<{ orderId: string }>(event)
  const orderId = body?.orderId
  if (!orderId) {
    throw createError({ statusCode: 400, statusMessage: 'orderId manquant' })
  }

  // 1) Charger la commande + items
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: { include: { product: true } } },
  })
  if (!order) {
    throw createError({ statusCode: 404, statusMessage: 'Commande introuvable' })
  }
  if (!order.orderItems.length) {
    throw createError({ statusCode: 400, statusMessage: 'La commande ne contient aucun article' })
  }

  // 2) Construire line_items pour Stripe (en centimes)
  const currency = 'eur'
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = order.orderItems.map((oi) => {
    const unit = Number(oi.unitPrice ?? oi.product.price ?? 0)
    const unit_amount = Math.round(unit * 100) // euros -> centimes
    return {
      quantity: oi.quantity,
      price_data: {
        currency,
        unit_amount,
        product_data: { name: oi.product.name },
      },
    }
  })

  // 3) Créer la checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    metadata: { orderId },
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
    cancel_url: `${siteUrl}/cart`,
    customer_email: order.email ?? undefined,
    line_items,
  })

  return { id: session.id, url: session.url }
})
