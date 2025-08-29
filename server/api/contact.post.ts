import { sendContactNotification, sendContactConfirmation } from "../utils/mailService"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	const { name, email, subject, message } = body

	if (
		!name ||
		!email ||
		!subject ||
		!message ||
		typeof name !== "string" ||
		typeof email !== "string" ||
		typeof subject !== "string" ||
		typeof message !== "string"
	) {
		throw createError({ statusCode: 400, statusMessage: "Données invalides" })
	}

	await sendContactNotification({ name, email, subject, message })
	await sendContactConfirmation({ name, email, subject, message })

	return { ok: true }
})
