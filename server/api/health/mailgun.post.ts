// server/api/health/mailgun.post.ts
import { defineEventHandler, readBody, createError } from "h3"
import { sendOrderEmailWithInvoice } from "~/server/utils/mailService"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ to?: string; subject?: string; html?: string }>(event)
    const to = body?.to || process.env.CONTACT_RECIPIENT || process.env.MAILGUN_FROM
    if (!to) throw createError({ statusCode: 400, statusMessage: "No recipient provided" })

    const res = await sendOrderEmailWithInvoice({
      to,
      subject: body?.subject ?? "Health test - Argan d'ici",
      html: body?.html ?? "<b>TEST-123</b>",
    })
    return { ok: true, id: (res as any)?.id ?? null }
  } catch (e: any) {
    // On renvoie un maximum d'info pour debug
    const status = e?.status || 500
    const message = e?.message || "Mailgun error"
    const details = e?.details
    const responseBody = e?.response?.body
    console.error("[health:mailgun]", { status, message, details, responseBody })
    throw createError({ statusCode: status, statusMessage: message, data: { details, responseBody } })
  }
})
