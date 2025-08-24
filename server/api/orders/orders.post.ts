import { OrderStatus, ShippingStatus } from "@prisma/client"
import { prisma } from "~/server/prisma/client"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (
    !body ||
    !body.items ||
    !body.email ||
    !body.fullName ||
    !body.addressLine1 ||
    !body.city ||
    !body.postalCode ||
    !body.country
  ) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Données manquantes pour la commande" }),
    )
  }

  const items = body.items as Array<{ productId: string; quantity: number; price: number }>
  const productIds = [...new Set(items.map(i => i.productId))]
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  // Compose lignes “propres” (unitPrice = prix officiel BDD)
  const lines = items.map(i => {
    const p = products.find(x => x.id === i.productId)
    if (!p) throw createError({ statusCode: 400, statusMessage: `Produit inconnu: ${i.productId}` })
    return {
      productId: i.productId,
      quantity: Math.max(1, Number(i.quantity || 1)),
      unitPrice: p.price,
    }
  })

  try {
    const order = await prisma.order.create({
      data: {
        email: body.email,
        fullName: body.fullName,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2 ?? null,
        city: body.city,
        postalCode: body.postalCode,
        country: body.country,
        total,
        status: OrderStatus.PENDING,
        shippingStatus: ShippingStatus.PREPARING,
        orderItems: {
          create: items.map((i) => ({
            product: { connect: { id: i.productId } },
            quantity: i.quantity,
            unitPrice: i.price,
          })),
        },
      },
      include: { orderItems: { include: { product: true } } },
    })

    return {
      success: true,
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        shippingStatus: order.shippingStatus,
        items: order.orderItems.map((i) => ({
          id: i.id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice ?? i.product.price,
        })),
      },
    }
  } catch (error) {
    console.error("Erreur création commande:", error)
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: "Erreur serveur création commande" }),
    )
  }
})
