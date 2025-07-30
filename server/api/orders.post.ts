import { PrismaClient, OrderStatus, ShippingStatus } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Récupère les données du body POST
  const body = await readBody(event)

  // Sécurité minimale : vérifie la présence des données requises
  if (!body || !body.items || !body.email || !body.fullName || !body.addressLine1 || !body.city || !body.postalCode || !body.country) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Données manquantes pour la commande' }))
  }

  // Calcul du total (côté back pour fiabilité)
  const items = body.items as Array<{
    productId: string
    quantity: number
    price: number
  }>
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // Création de la commande et des items liés
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
          create: items.map(item => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
          }))
        }
      },
      include: {
        orderItems: true
      }
    })

    // (Optionnel) Tu pourras ici déclencher la notif Telegram ou l’email !

    // Réponse (id + détails de commande)
    return {
      success: true,
      order: {
        id: order.id,
        total: order.total,
        items: order.orderItems,
        status: order.status,
        shippingStatus: order.shippingStatus
      }
    }
  } catch (error) {
    console.error('Erreur création commande:', error)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Erreur serveur création commande' }))
  }
})
