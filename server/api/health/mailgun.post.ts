import { sendInvoiceEmail } from '~/server/utils/mailService'

export default defineEventHandler(async () => {
  await sendInvoiceEmail({ to: 'ton@email', orderId: 'TEST-123' })
  return { ok: true }
})
