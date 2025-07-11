import { defineStore } from 'pinia'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  actions: {
    addItem(product: Omit<CartItem, 'quantity'>, quantity: number) {
      const item = this.items.find(i => i.id === product.id)
      if (item) item.quantity += quantity
      else this.items.push({ ...product, quantity })
    },
    removeItem(id: string) {
      this.items = this.items.filter(i => i.id !== id)
    },
    clear() {
      this.items = []
    }
  }
})
