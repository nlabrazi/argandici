<template>
  <section class="max-w-3xl mx-auto py-12 px-4 md:px-8">
    <h1 class="text-3xl font-serif text-argan-dark mb-8">Finaliser ma commande</h1>

    <div v-if="cart.items.length === 0" class="text-center py-16">
      <p class="text-xl text-gray-600">Votre panier est vide.</p>
      <NuxtLink to="/products"
        class="inline-block mt-4 bg-argan-gold hover:bg-argan-dark text-white px-6 py-3 rounded-full transition">
        Retourner aux produits
      </NuxtLink>
    </div>

    <div v-else v-inview class="reveal reveal-down">
      <form @submit.prevent="submitOrder" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom complet</label>
            <input v-model="form.fullName" type="text" required class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
       px-4 h-10 text-gray-900 placeholder-gray-400
       caret-argan-gold focus:outline-none focus:ring-2
       focus:ring-argan-gold/60 focus:border-argan-gold text-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="form.email" type="email" required class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
       px-4 h-10 text-gray-900 placeholder-gray-400
       caret-argan-gold focus:outline-none focus:ring-2
       focus:ring-argan-gold/60 focus:border-argan-gold text-lg">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Adresse ligne 1</label>
          <input v-model="form.addressLine1" type="text" required class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
       px-4 h-10 text-gray-900 placeholder-gray-400
       caret-argan-gold focus:outline-none focus:ring-2
       focus:ring-argan-gold/60 focus:border-argan-gold text-lg">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Adresse ligne 2 (facultatif)</label>
          <input v-model="form.addressLine2" type="text" class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
       px-4 h-10 text-gray-900 placeholder-gray-400
       caret-argan-gold focus:outline-none focus:ring-2
       focus:ring-argan-gold/60 focus:border-argan-gold text-lg">
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Ville</label>
            <input v-model="form.city" type="text" required class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
       px-4 h-10 text-gray-900 placeholder-gray-400
       caret-argan-gold focus:outline-none focus:ring-2
       focus:ring-argan-gold/60 focus:border-argan-gold text-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Code postal</label>
            <input v-model="form.postalCode" type="text" required class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
       px-4 h-10 text-gray-900 placeholder-gray-400
       caret-argan-gold focus:outline-none focus:ring-2
       focus:ring-argan-gold/60 focus:border-argan-gold text-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Pays</label>
            <input v-model="form.country" type="text" required class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
       px-4 h-10 text-gray-900 placeholder-gray-400
       caret-argan-gold focus:outline-none focus:ring-2
       focus:ring-argan-gold/60 focus:border-argan-gold text-lg">
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
          <h2 class="text-2xl font-serif text-argan-dark mb-4">Récapitulatif de votre panier</h2>
          <div v-for="item in detailedItems" :key="item.productId"
            class="flex justify-between items-center py-2 border-b">
            <div class="flex items-center gap-4">
              <NuxtImg :src="item.image" :alt="item.name" class="w-12 h-12 object-cover rounded-lg" />
              <span class="text-gray-800">{{ item.name }} x {{ item.quantity }}</span>
            </div>
            <span class="text-gray-700">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
          <div class="flex justify-between items-center mt-4">
            <span class="font-medium text-xl">Total</span>
            <span class="text-xl font-bold">{{ formatPrice(total) }}</span>
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-600 mb-2">{{ errorMessage }}</div>

        <button type="submit" :disabled="isLoading"
          class="bg-argan-gold hover:bg-argan-dark text-white px-6 py-3 rounded-full transition w-full disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? 'Validation...' : 'Payer ma commande' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useCartStore } from "~/stores/cart"
import { useProductsStore } from "~/stores/products"
import { useNotificationStore } from "~/stores/notifications"

const cart = useCartStore()
const productsStore = useProductsStore()
const notifications = useNotificationStore()

const form = ref({
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  country: "",
  email: "",
})

const isLoading = ref(false)
const errorMessage = ref("")

function formatPrice(price: number) {
  return price.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
}

// Charger les produits (SSR-friendly)
await productsStore.fetchProducts()

// Réhydrate chaque ligne avec les méta produits
const detailedItems = computed(() =>
  cart.items.map((li) => {
    const p = productsStore.getById(li.productId)
    return {
      productId: li.productId,
      quantity: li.quantity,
      name: p?.name ?? "Produit",
      image: p?.image ?? "",
      price: p?.price ?? 0,
    }
  }),
)

const total = computed(() => detailedItems.value.reduce((s, it) => s + it.price * it.quantity, 0))

async function submitOrder() {
  isLoading.value = true
  errorMessage.value = ""

  // 1) Créer la commande (serveur doit revalider les prix)
  const itemsPayload = detailedItems.value.map((it) => ({
    productId: it.productId,
    quantity: it.quantity,
    price: it.price, // facultatif: le serveur doit recalculer de toute façon
  }))

  const orderRes = await $fetch("/api/orders/orders", {
    method: "POST",
    body: {
      items: itemsPayload,
      ...form.value,
    },
  }).catch(() => {
    isLoading.value = false
    errorMessage.value = "Erreur lors de la création de la commande"
    return null
  })

  if (!orderRes?.order?.id) {
    errorMessage.value = "Création de commande impossible"
    isLoading.value = false
    return
  }

  // 2) Créer la session Stripe
  const stripeRes = await $fetch("/api/payments/checkout", {
    method: "POST",
    body: {
      cart: detailedItems.value.map((it) => ({
        id: it.productId,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
      email: form.value.email,
      orderId: orderRes.order.id,
    },
  }).catch(() => {
    isLoading.value = false
    errorMessage.value = "Erreur lors de la création du paiement Stripe"
    return null
  })

  if (!stripeRes?.url) {
    errorMessage.value = "Impossible de créer la session de paiement"
    isLoading.value = false
    return
  }

  window.location.href = stripeRes.url
}
</script>
