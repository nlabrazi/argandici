// server/utils/mailService.ts
import Mailgun from "mailgun.js"
import formData from "form-data"

// ── ENV ──────────────────────────────────────────────────────────────────────
const apiKey = process.env.MAILGUN_API_KEY
const domain = process.env.MAILGUN_DOMAIN // ex: mg.argandici.com ou sandboxxxxx.mailgun.org
const fromEmail = process.env.MAILGUN_FROM ?? (domain ? `postmaster@${domain}` : undefined) // fallback propre
const contactRecipient = process.env.CONTACT_RECIPIENT ?? "contact@argandici.com"

// Région : EU => api.eu.mailgun.net, US => api.mailgun.net (par défaut EU)
const region = (process.env.MAILGUN_REGION || "EU").toUpperCase()
const baseUrl = region === "US" ? "https://api.mailgun.net" : "https://api.eu.mailgun.net"

// ── CLIENT ───────────────────────────────────────────────────────────────────
const mailgun = new Mailgun(formData)
const mgClient =
	apiKey && domain ? mailgun.client({ username: "api", key: apiKey, url: baseUrl }) : null

function requireMailgun() {
	if (!apiKey) throw new Error("MAILGUN_API_KEY missing")
	if (!domain) throw new Error("MAILGUN_DOMAIN missing")
	if (!fromEmail) throw new Error("MAILGUN_FROM missing (and no default could be derived)")
	if (!mgClient) throw new Error("Mailgun client not initialized")
}

// Envoi avec logs d’erreur détaillés (status, body renvoyé par Mailgun, etc.)
async function sendWithLogs(msg: any) {
	requireMailgun()
	try {
		const res = await mgClient!.messages.create(domain!, msg)
		console.log("[mailgun] sent:", res?.id ?? res)
		return res
	} catch (e: any) {
		const status = e?.status
		const message = e?.message
		const details = e?.details
		const responseBody = e?.response?.body
		console.error("[mailgun] ERROR", {
			status,
			message,
			details,
			responseBody,
			domain,
			fromEmail,
			baseUrl,
		})
		throw e
	}
}

// ── API PUBLIQUE ─────────────────────────────────────────────────────────────
// ✅ Notification interne “contact”
export async function sendContactNotification({
	name,
	email,
	subject,
	message,
}: {
	name: string
	email: string
	subject: string
	message: string
}) {
	const html = `
    <h2>Nouveau message de contact</h2>
    <p><strong>De:</strong> ${name} (${email})</p>
    <p><strong>Sujet:</strong> ${subject}</p>
    <h3>Message:</h3>
    <p>${message}</p>
    <p><em>Message reçu le ${new Date().toLocaleString("fr-FR")}</em></p>
  `
	const res = await sendWithLogs({
		from: `Site Web Argan d'ici <${fromEmail}>`,
		to: [contactRecipient],
		subject: `[CONTACT] ${subject}`,
		html,
	} as any)

	// 👇 ton log d'origine rétabli
	console.log(`📧 Notification de contact envoyée à ${contactRecipient}`)
	return res
}

// ✅ Accusé de réception “contact” au client
export async function sendContactConfirmation({
	name,
	email,
	subject,
	message,
}: {
	name: string
	email: string
	subject: string
	message: string
}) {
	const html = `
    <h2>Confirmation de réception de votre message</h2>
    <p>Bonjour ${name},</p>
    <p>Nous avons bien reçu votre message et vous remercions de nous avoir contactés.</p>
    <h3>Récapitulatif :</h3>
    <p><strong>Sujet :</strong> ${subject}</p>
    <blockquote>${message}</blockquote>
    <p>Cordialement,<br/><strong>L'équipe Argan d'ici</strong></p>
  `
	const res = await sendWithLogs({
		from: `Argan d'ici <${fromEmail}>`,
		to: [email],
		subject: `Confirmation de réception : ${subject}`,
		html,
	} as any)

	// 👇 ton log d'origine rétabli
	console.log(`📧 Confirmation de contact envoyée à ${email}`)
	return res
}

// ✅ Email commande unique (template HTML) + PJ PDF optionnelle
export async function sendOrderEmailWithInvoice({
	to,
	subject,
	html,
	pdfBuffer,
	pdfFilename,
}: {
	to: string
	subject?: string
	html: string
	pdfBuffer?: Buffer
	pdfFilename?: string
}) {
	const msg: any = {
		from: `Argan d'ici <${fromEmail}>`,
		to: [to],
		subject: subject ?? "Votre commande - Argan d'ici",
		html,
	}
	if (pdfBuffer && pdfFilename) {
		msg.attachment = [{ filename: pdfFilename, data: pdfBuffer }]
	}

	const res = await sendWithLogs(msg)

	// 👇 ton log d'origine rétabli
	console.log(`📧 Order email sent to ${to}`)
	return res
}
