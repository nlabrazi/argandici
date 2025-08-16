<template>
  <section class="max-w-4xl mx-auto py-12 px-4 md:px-8">
    <h1 class="font-serif text-3xl text-argan-dark mb-8 text-center">Votre panier</h1>

    <!-- Panier vide -->
    <div v-if="cart.items.length === 0" class="text-center py-24">
      <i class="fas fa-shopping-cart text-5xl text-gray-300 mb-6"></i>
      <p class="text-argan-dark text-xl mb-4">Votre panier est vide.</p>
      <NuxtLink to="/products"
        class="inline-block bg-argan-gold hover:bg-argan-dark text-white px-6 py-3 rounded-full transition">
        Voir la boutique
      </NuxtLink>
    </div>

    <!-- Panier avec produits -->
    <div v-else>
      <div v-inview class="reveal reveal-down space-y-8 mb-8">
        <div v-for="item in cart.items" :key="item.productId"
          class="flex flex-col md:flex-row items-center gap-6 bg-white rounded-xl shadow-sm p-4">
          <NuxtImg :src="item.image" :alt="item.name" class="w-28 h-28 object-contain rounded-lg bg-argan-light" />
          <div class="flex-1">
            <h2 class="font-serif text-lg text-argan-dark">{{ item.name }}</h2>
            <p class="text-argan-gold font-bold mb-2">{{ formatPrice(item.price) }}</p>
            <div class="flex items-center gap-2">
              <button @click="decrease(item)" class="px-3 py-1 text-xl text-argan-gold hover:text-argan-dark"
                :disabled="item.quantity <= 1">-</button>
              <span class="font-medium">{{ item.quantity }}</span>
              <button @click="increase(item)" class="px-3 py-1 text-xl text-argan-gold hover:text-argan-dark">+</button>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <button @click="remove(item)" class="text-red-400 hover:text-red-700 text-sm mt-2 flex items-center gap-2">
              <i class="fas fa-trash"></i> Retirer
            </button>
          </div>
        </div>
      </div>

      <!-- Résumé -->
      <div v-inview
        class="reveal reveal-up bg-argan-light rounded-xl p-6 flex flex-col md:flex-row items-center justify-between mb-4">
        <div class="font-serif text-xl text-argan-dark mb-4 md:mb-0">
          Total : <span class="font-bold text-argan-gold">{{ formatPrice(cart.total) }}</span>
        </div>
        <div class="flex gap-4">
          <button @click="checkout"
            class="bg-argan-gold hover:bg-argan-dark text-white px-6 py-3 rounded-full transition font-medium flex items-center gap-2">
            <i class="fas fa-credit-card"></i>
            Valider la commande
          </button>
          <button @click="clear"
            class="bg-gray-200 hover:bg-red-200 text-gray-600 px-6 py-3 rounded-full transition font-medium flex items-center gap-2">
            <i class="fas fa-times"></i>
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useNotificationStore } from '~/stores/notifications'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const notifications = useNotificationStore()
const router = useRouter()

function formatPrice(price: number) {
  return price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}
function increase(item: any) {
  cart.updateQuantity(item.productId, item.quantity + 1)
  notifications.showToast(`Quantité augmentée : ${item.name}`, 'info')
}
function decrease(item: any) {
  if (item.quantity > 1) {
    cart.updateQuantity(item.productId, item.quantity - 1)
    notifications.showToast(`Quantité diminuée : ${item.name}`, 'info')
  }
}
function remove(item: any) {
  cart.removeFromCart(item.productId)
  notifications.showToast(`${item.name} retiré du panier`, 'warning')
}
function clear() {
  cart.clearCart()
  notifications.showToast('Panier vidé', 'warning')
}
function checkout() {
  notifications.showToast('Veuillez renseigner vos infos pour finaliser la commande.', 'info')
  router.push('/checkout')
}
</script>
