import { defineStore } from 'pinia'

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    version: '1.0',
    items: [] as CartItem[],
  }),
  persist: true,
  getters: {
    total(state): number {
      return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    count(state): number {
      return state.items.reduce((n, item) => n + item.quantity, 0)
    }
  },
  actions: {
    addToCart(product: Omit<CartItem, 'quantity'>, quantity = 1) {
      const existing = this.items.find(i => i.productId === product.productId)
      if (existing) existing.quantity += quantity
      else this.items.push({ ...product, quantity })
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
