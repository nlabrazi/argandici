// stores/cart.ts
import { defineStore } from 'pinia'

export interface CartLine {
  productId: string
  quantity: number
}

export interface CartState {
  version: string
  items: CartLine[]
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    version: '1.0',
    items: [],
  }),
  persist: true,
  getters: {
    count: (state) => state.items.reduce((n, it) => n + it.quantity, 0),
  },
  actions: {
    addToCart(product: { id?: string; productId?: string } | string, quantity = 1) {
      const productId = typeof product === 'string'
        ? product
        : (product.productId ?? product.id)
      if (!productId) return
      const existing = this.items.find(i => i.productId === productId)
      existing ? (existing.quantity += quantity) : this.items.push({ productId, quantity })
    },
    removeFromCart(productId: string) {
      this.items = this.items.filter(i => i.productId !== productId)
    },
    updateQuantity(productId: string, qty: number) {
      const item = this.items.find(i => i.productId === productId)
      if (item) item.quantity = Math.max(1, qty)
    },
    clearCart() {
      this.items = []
    }
  }
})
