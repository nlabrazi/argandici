import { getQuery, setHeader, setResponseStatus } from "h3"
import { prisma } from "~/server/prisma/client"

export default defineEventHandler(async (event) => {
	setHeader(event, "Cache-Control", "no-store")

	const { key } = getQuery(event)
	if (process.env.HEALTH_KEY && key !== process.env.HEALTH_KEY) {
		setResponseStatus(event, 401)
		return { ok: false, error: "unauthorized" }
	}

	try {
		await prisma.$queryRaw`SELECT 1`
		return { ok: true, db: "up" }
	} catch (e) {
		setResponseStatus(event, 503, "Service Unavailable")
		return { ok: false, db: "down" }
	}
})
