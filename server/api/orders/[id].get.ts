import { defineEventHandler, createError } from "h3"
import { prisma } from "~/server/prisma/client"

export default defineEventHandler(async (event) => {
	const id = event.context.params?.id
	if (!id) throw createError({ statusCode: 400, statusMessage: "orderId manquant" })

	const order = await prisma.order.findUnique({
		where: { id },
		include: { orderItems: { include: { product: true } } },
	})
	if (!order) throw createError({ statusCode: 404, statusMessage: "Commande introuvable" })

	return {
		id: order.id,
		status: order.status,
		shippingStatus: order.shippingStatus,
		total: order.total,
		email: order.email,
		fullName: order.fullName,
		createdAt: order.date,
		invoiceUrl: order.invoiceUrl ?? null,
		items: order.orderItems.map((oi) => ({
			name: oi.product.name,
			quantity: oi.quantity,
			price: oi.product.price,
		})),
	}
})
