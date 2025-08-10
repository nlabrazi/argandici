import { prisma } from '~/server/prisma/client'

export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    return prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }
})
