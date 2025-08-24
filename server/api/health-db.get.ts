import { getQuery, setHeader, setResponseStatus } from "h3"
import { prisma } from "~/server/prisma/client"

export default defineEventHandler(async (event) => {
	// Pas de cache
	setHeader(event, "Cache-Control", "no-store")

	// Clé simple pour éviter les abus
	const { key } = getQuery(event)
	if (process.env.HEALTH_KEY && key !== process.env.HEALTH_KEY) {
		setResponseStatus(event, 401)
		return { ok: false, error: "unauthorized" }
	}

	try {
		// Requête ultra-légère
		await prisma.$queryRaw`SELECT 1`
		return { ok: true, db: "up" }
	} catch (e) {
		// Quand Supabase est "froide" ou down
		setResponseStatus(event, 503, "Service Unavailable")
		return { ok: false, db: "down" }
	}
})
