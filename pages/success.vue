<template>
  <section class="max-w-2xl mx-auto py-16 text-center">
    <i class="fas fa-check-circle text-green-500 text-6xl mb-6"></i>
    <h1 class="text-3xl font-serif text-argan-dark mb-4">Merci pour votre commande !</h1>
    <p class="text-lg text-gray-700 mb-6">
      Votre paiement a bien été validé. Vous recevrez un email de confirmation avec votre facture.
    </p>

    <div v-if="order">
      <p class="text-gray-600 mb-2">Numéro de commande : <span class="font-mono">{{ order.id }}</span></p>
      <p class="text-argan-gold font-bold text-xl mb-4">Total : {{ formatPrice(order.total) }}</p>
    </div>

    <NuxtLink to="/products" class="bg-argan-gold hover:bg-argan-dark text-white px-6 py-3 rounded-full transition">
      Retourner à la boutique
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const sessionId = route.query.session_id as string | undefined
const order = ref<any>(null)

function formatPrice(price: number) {
  return price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

// 🔹 Exemple d’appel API pour récupérer la commande par session
if (sessionId) {
  const res = await $fetch(`/api/orders/by-session?session_id=${sessionId}`)
  order.value = res.order
}
</script>
