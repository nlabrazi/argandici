<template>
  <section class="max-w-3xl mx-auto py-12 px-4 md:px-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-serif text-argan-dark">Détail de votre commande</h1>
      <p class="text-gray-600 mt-2">Retrouvez le statut et le récapitulatif.</p>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="text-center py-16">
      <p class="text-gray-700">Chargement de la commande…</p>
    </div>

    <!-- Erreur / 404 -->
    <div v-else-if="error" class="text-center py-16">
      <h2 class="text-2xl font-serif text-red-700">Commande introuvable</h2>
      <p class="text-gray-600 mt-2">Vérifiez votre lien ou contactez-nous.</p>
      <NuxtLink to="/products" class="inline-block mt-6 underline">Retourner à la boutique</NuxtLink>
    </div>

    <!-- Contenu -->
    <div v-else class="space-y-6">
      <!-- En-tête -->
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 class="font-serif text-2xl text-argan-dark">Commande #{{ order.id }}</h2>
            <p class="text-gray-600">Passée le {{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="flex gap-2">
            <span class="px-3 py-1 rounded-full text-sm" :class="badgeClass(order.status)">
              Statut : {{ humanOrderStatus(order.status) }}
            </span>
            <span class="px-3 py-1 rounded-full text-sm" :class="badgeShipClass(order.shippingStatus)">
              Livraison : {{ humanShipStatus(order.shippingStatus) }}
            </span>
          </div>
        </div>

        <div v-if="order.email || order.fullName" class="mt-4 text-gray-700 space-y-1">
          <p v-if="order.fullName"><strong>Client :</strong> {{ order.fullName }}</p>
          <p v-if="order.email"><strong>Email :</strong> {{ order.email }}</p>
        </div>
      </div>

      <!-- Articles -->
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="font-serif text-xl text-argan-dark mb-4">Articles</h3>
        <div class="divide-y">
          <div v-for="(it, idx) in order.items" :key="idx" class="py-3 flex items-center justify-between">
            <div class="pr-4">
              <div class="font-medium text-gray-900">{{ it.name }}</div>
              <div class="text-sm text-gray-600">Qté : {{ it.quantity }}</div>
            </div>
            <div class="text-gray-800 font-medium">
              {{ formatPrice(it.price * it.quantity) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Total & actions -->
      <div class="bg-argan-light rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="text-xl">
          Total TTC : <span class="font-bold text-argan-gold">{{ formatPrice(order.total) }}</span>
        </div>
        <div class="flex flex-wrap gap-3">
          <a v-if="order.invoiceUrl" :href="order.invoiceUrl" target="_blank" rel="noopener"
            class="bg-white border border-argan-gold text-argan-dark hover:bg-argan-light px-5 py-3 rounded-full transition flex items-center gap-2">
            <i class="fas fa-file-invoice"></i> Télécharger la facture
          </a>
          <NuxtLink to="/products"
            class="bg-argan-gold hover:bg-argan-dark text-white px-6 py-3 rounded-full transition flex items-center gap-2">
            Continuer mes achats
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const id = route.params.id as string

type OrderView = {
	id: string
	status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
	shippingStatus: "PREPARING" | "SHIPPED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED"
	total: number
	email: string | null
	fullName: string | null
	createdAt: string
	invoiceUrl?: string | null
	items: { name: string; quantity: number; price: number }[]
}

const {
	public: { siteUrl },
} = useRuntimeConfig()
const endpoint = `${siteUrl.replace(/\/$/, "")}/api/orders/${id}`

const { data, pending, error, refresh } = await useAsyncData<OrderView>(
	`order-${id}`,
	() => $fetch<OrderView>(endpoint),
	{ server: true },
)

const order = computed(
	() =>
		data.value as {
			id: string
			status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
			shippingStatus: "PREPARING" | "SHIPPED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED"
			total: number
			email: string | null
			fullName: string | null
			createdAt: string
			invoiceUrl?: string | null
			items: { name: string; quantity: number; price: number }[]
		},
)

if (process.client) {
	setTimeout(() => refresh(), 2000)
	const int = setInterval(() => {
		const s = order.value?.shippingStatus
		if (!s || s === "DELIVERED" || s === "CANCELLED") return clearInterval(int)
		refresh()
	}, 60000)
}

function formatPrice(x: number) {
	return x.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
}
function formatDate(iso: string) {
	const d = new Date(iso)
	return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
}

function humanOrderStatus(s: string) {
	switch (s) {
		case "PENDING":
			return "En attente de paiement"
		case "PAID":
			return "Payée"
		case "SHIPPED":
			return "Expédiée"
		case "DELIVERED":
			return "Livrée"
		case "CANCELLED":
			return "Annulée"
		case "REFUNDED":
			return "Remboursée"
		default:
			return s
	}
}
function humanShipStatus(s: string) {
	switch (s) {
		case "PREPARING":
			return "En préparation"
		case "SHIPPED":
			return "Expédiée"
		case "IN_TRANSIT":
			return "En transit"
		case "DELIVERED":
			return "Livrée"
		case "CANCELLED":
			return "Annulée"
		default:
			return s
	}
}

function badgeClass(s: string) {
	return {
		"bg-yellow-100 text-yellow-800": s === "PENDING",
		"bg-green-100 text-green-800": s === "PAID" || s === "DELIVERED",
		"bg-blue-100 text-blue-800": s === "SHIPPED",
		"bg-gray-100 text-gray-800": s === "REFUNDED",
		"bg-red-100 text-red-800": s === "CANCELLED",
	}
}
function badgeShipClass(s: string) {
	return {
		"bg-yellow-100 text-yellow-800": s === "PREPARING",
		"bg-blue-100 text-blue-800": s === "SHIPPED" || s === "IN_TRANSIT",
		"bg-green-100 text-green-800": s === "DELIVERED",
		"bg-red-100 text-red-800": s === "CANCELLED",
	}
}
</script>

<style scoped></style>
