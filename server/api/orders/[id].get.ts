// server/api/orders/[id].get.ts
import { defineEventHandler, createError } from 'h3'
import { prisma } from '~/server/prisma/client'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'orderId manquant' })

  const order = await prisma.order.findUnique({
    where: { id },
    include: { orderItems: { include: { product: true } } }
  })
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Commande introuvable' })

  return {
    id: order.id,
    status: order.status,                  // PENDING | PAID | ...
    shippingStatus: order.shippingStatus,
    total: order.total,
    email: order.email,
    fullName: order.fullName,
    createdAt: order.date,
    invoiceUrl: order.invoiceUrl ?? null, // si tu as ajouté ce champ
    items: order.orderItems.map(oi => ({
      name: oi.product.name,
      quantity: oi.quantity,
      price: oi.product.price,
    })),
    // plus tard : invoiceUrl si tu ajoutes un champ en BDD
  }
})
