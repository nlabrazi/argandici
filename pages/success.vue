<template>
  <section class="max-w-3xl mx-auto py-12 px-4 md:px-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-serif text-argan-dark">Merci pour votre commande ✨</h1>
      <p class="text-gray-600 mt-2">Nous confirmons votre paiement et préparons votre colis.</p>
    </div>

    <div v-if="state === 'loading'" class="text-center py-12">
      <p class="text-gray-700">Validation en cours…</p>
    </div>

    <div v-else-if="state === 'paid'" class="space-y-6">
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="font-serif text-2xl text-argan-dark mb-2">Commande confirmée</h2>
        <p class="text-gray-700">Numéro de commande : <strong>{{ orderId }}</strong></p>
        <p class="text-gray-700">Statut : <strong class="text-green-700">Payée</strong></p>
        <p v-if="email" class="text-gray-700 mt-2">
          Un e-mail de confirmation a été envoyé à <strong>{{ email }}</strong>.
        </p>
      </div>

      <div v-if="orderTotal !== null" class="bg-argan-light rounded-xl p-6">
        <div class="flex items-center justify-between">
          <span class="text-xl">Total payé</span>
          <span class="text-xl font-bold">{{ formatCents(orderTotal, currency) }}</span>
        </div>
      </div>

      <NuxtLink to="/products"
        class="inline-block bg-argan-gold hover:bg-argan-dark text-white px-6 py-3 rounded-full transition">
        Continuer mes achats
      </NuxtLink>
    </div>

    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-serif text-red-700">Paiement non confirmé</h2>
      <p class="text-gray-600 mt-2">Si vous pensez que c’est une erreur, contactez-nous avec votre e-mail.</p>
      <NuxtLink to="/cart" class="inline-block mt-6 underline">Retourner au panier</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { useCartStore } from "~/stores/cart"
import { useNotificationStore } from "~/stores/notifications"

type State = "loading" | "paid" | "unpaid"

const route = useRoute()
const cart = useCartStore()
const notifications = useNotificationStore()

const state = ref<State>("loading")
const email = ref<string | null>(null)
const orderId = ref<string | null>((route.query.order_id as string) || null)
const orderTotal = ref<number | null>(null) // cents
const currency = ref<string>("eur")

function formatCents(amount: number | null, currency: string) {
	if (amount === null) return ""
	return (amount / 100).toLocaleString("fr-FR", { style: "currency", currency })
}

async function pollOrderPaid(id: string, tries = 8) {
	for (let i = 0; i < tries; i++) {
		try {
			// ✅ Corrigé: pas de doublon "orders"
			const res = await $fetch<{ status: string }>(`/api/orders/${id}`)
			if (res.status === "PAID") return true
		} catch {}
		await new Promise((r) => setTimeout(r, 1200))
	}
	return false
}

let cartCleared = false
function clearCartOnce() {
	if (!cartCleared) {
		cart.clearCart()
		cartCleared = true
	}
}

onMounted(async () => {
	const sessionId = route.query.session_id as string | undefined
	if (!sessionId) {
		state.value = "unpaid"
		return
	}

	try {
		const session = await $fetch<{
			payment_status: "paid" | "unpaid" | "no_payment_required"
			amount_total: number | null
			currency: string
			email: string | null
			orderId: string | null
		}>(`/api/payments/session?id=${sessionId}`)

		email.value = session.email
		currency.value = session.currency || "eur"
		if (session.amount_total != null) orderTotal.value = session.amount_total
		if (!orderId.value && session.orderId) orderId.value = session.orderId

		if (session.payment_status === "paid") {
			if (orderId.value) {
				const ok = await pollOrderPaid(orderId.value)
				if (ok) {
					state.value = "paid"
					clearCartOnce()
					notifications.showToast("Paiement confirmé. Merci !", "success")
					return
				}
			}
			state.value = "paid"
			clearCartOnce()
			return
		}

		state.value = "unpaid"
	} catch (e) {
		state.value = "unpaid"
	}
})
</script>
