// server/api/health/telegram.post.ts
import { defineEventHandler, readBody, createError } from "h3"

export default defineEventHandler(async (event) => {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    throw createError({ statusCode: 500, statusMessage: "TELEGRAM_* envs missing" })
  }
  const body = await readBody<{ text?: string }>(event)
  const text = body?.text || "Health test Telegram ✅"

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => "")
    console.error("[health:telegram] sendMessage error:", res.status, msg)
    throw createError({ statusCode: 500, statusMessage: `Telegram error: ${res.status} ${msg}` })
  }
  return { ok: true }
})
