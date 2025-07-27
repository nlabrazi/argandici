import { prisma } from '~/server/prisma/client'

export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    const products = await prisma.product.findMany()
    return products
  }
})
