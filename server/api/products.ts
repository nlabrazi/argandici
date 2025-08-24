import { prisma } from "~/server/prisma/client"

export default defineEventHandler(async (event) => {
	try {
		const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } })
		return products
	} catch (err) {
		console.error("GET /api/products error", err)
		setResponseStatus(event, 503, "Service Unavailable")
		return { message: "Service momentanément indisponible. Réessayez dans quelques minutes." }
	}
})
