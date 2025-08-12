import { prisma } from '~/server/prisma/client'

export default defineEventHandler(async () => {
  return prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
})
