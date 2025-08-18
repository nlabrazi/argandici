// server/utils/telegram.ts

export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID manquant — envoi Telegram ignoré.')
    return
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(`Telegram sendMessage error: ${res.status} ${msg}`)
  }
}

// Beau message façon NestJS (simple, sans typage strict)
export function buildTelegramOrderMessage(order: any) {
  const itemsText = order.orderItems
    .map((item: any) => {
      const unit = Number(item.unitPrice ?? item.product.price ?? 0)
      const lineTotal = (unit * item.quantity).toFixed(2)
      return `🛒 <b>${item.quantity} x ${item.product.name}</b> — ${lineTotal} €`
    })
    .join('\n')

  const totalText = `<b>Total : ${Number(order.total).toFixed(2)} €</b>`
  const addressText =
    `📍 Livraison :\n${order.fullName ?? ''}\n${order.addressLine1 ?? ''}\n${order.addressLine2 ?? ''}\n${order.postalCode ?? ''} ${order.city ?? ''}, ${order.country ?? ''}`

  const customer = order.email ?? 'Client connecté'
  return `📦 Nouvelle commande reçue\n\n👤 <b>${customer}</b>\n\n${itemsText}\n${totalText}\n\n${addressText}`
}
