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

      <!-- vee-validate v5 sait consommer directement le schéma Zod -->
      <Form :validation-schema="schema" :initial-values="form" @submit="(values) => onSubmit(values as CheckoutValues)"
        v-slot="{ errors, meta, setFieldValue }" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom complet</label>
            <Field name="fullName" as="input" type="text" class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
                     px-4 h-10 text-gray-900 placeholder-gray-400
                     caret-argan-gold focus:outline-none focus:ring-2
                     focus:ring-argan-gold/60 focus:border-argan-gold text-lg" />
            <ErrorMessage name="fullName" class="text-red-600 text-sm mt-1" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <Field name="email" as="input" type="email" autocomplete="email" class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
                     px-4 h-10 text-gray-900 placeholder-gray-400
                     caret-argan-gold focus:outline-none focus:ring-2
                     focus:ring-argan-gold/60 focus:border-argan-gold text-lg" />
            <ErrorMessage name="email" class="text-red-600 text-sm mt-1" />
          </div>
        </div>

        <!-- Adresse ligne 1 avec Autocomplete API Adresse -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Adresse ligne 1</label>
          <Field name="addressLine1" v-slot="{ value, handleChange }">
            <AddressAutocomplete :modelValue="(value as string) || ''" placeholder="12 Rue de l'Exemple"
              @update:modelValue="(v) => handleChange(v)" @select="(addr) => {
                setFieldValue('addressLine1', addr.line1)
                if (addr.postalCode) setFieldValue('postalCode', addr.postalCode)
                if (addr.city) setFieldValue('city', addr.city)
                setFieldValue('country', 'France')
              }" />
          </Field>
          <ErrorMessage name="addressLine1" class="text-red-600 text-sm mt-1" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Adresse ligne 2 (facultatif)</label>
          <Field name="addressLine2" as="input" type="text" class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
                   px-4 h-10 text-gray-900 placeholder-gray-400
                   caret-argan-gold focus:outline-none focus:ring-2
                   focus:ring-argan-gold/60 focus:border-argan-gold text-lg" />
          <ErrorMessage name="addressLine2" class="text-red-600 text-sm mt-1" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Ville</label>
            <Field name="city" as="input" type="text" autocomplete="address-level2" class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
                     px-4 h-10 text-gray-900 placeholder-gray-400
                     caret-argan-gold focus:outline-none focus:ring-2
                     focus:ring-argan-gold/60 focus:border-argan-gold text-lg" />
            <ErrorMessage name="city" class="text-red-600 text-sm mt-1" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Code postal</label>
            <Field name="postalCode" as="input" type="text" inputmode="numeric" autocomplete="postal-code" class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
                     px-4 h-10 text-gray-900 placeholder-gray-400
                     caret-argan-gold focus:outline-none focus:ring-2
                     focus:ring-argan-gold/60 focus:border-argan-gold text-lg" />
            <ErrorMessage name="postalCode" class="text-red-600 text-sm mt-1" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Pays</label>
            <Field name="country" as="input" type="text" autocomplete="country-name" class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
                     px-4 h-10 text-gray-900 placeholder-gray-400
                     caret-argan-gold focus:outline-none focus:ring-2
                     focus:ring-argan-gold/60 focus:border-argan-gold text-lg" />
            <ErrorMessage name="country" class="text-red-600 text-sm mt-1" />
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

        <button type="submit" :disabled="isSubmitting || !meta.valid || cart.items.length === 0"
          class="bg-argan-gold hover:bg-argan-dark text-white px-6 py-3 rounded-full transition w-full disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'Validation...' : 'Payer ma commande' }}
        </button>
      </Form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useCartStore } from "~/stores/cart"
import { useProductsStore } from "~/stores/products"

import AddressAutocomplete from "@/components/AdressAutocomplete.vue"

import { Form, Field, ErrorMessage } from "vee-validate"
import { z } from "zod"

const cart = useCartStore()
const productsStore = useProductsStore()

const schema = z.object({
	fullName: z.string().trim().min(2, "Veuillez saisir votre nom complet"),
	email: z.string().trim().email("Email invalide"),
	addressLine1: z.string().trim().min(5, "Adresse requise"),
	addressLine2: z.string().trim().optional().or(z.literal("")),
	city: z.string().trim().min(2, "Ville requise"),
	postalCode: z
		.string()
		.trim()
		.regex(/^\d{5}$/, "Code postal (FR) à 5 chiffres"),
	country: z.string().trim().min(2, "Pays requis"),
})

type CheckoutValues = z.infer<typeof schema>

const form = ref<CheckoutValues>({
	fullName: "",
	addressLine1: "",
	addressLine2: "",
	city: "",
	postalCode: "",
	country: "France",
	email: "",
})

const isSubmitting = ref(false)
const errorMessage = ref("")

function formatPrice(price: number) {
	return price.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
}

await productsStore.fetchProducts()

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

const onSubmit = async (values: CheckoutValues) => {
	isSubmitting.value = true
	errorMessage.value = ""

	try {
		const itemsPayload = detailedItems.value.map((it) => ({
			productId: it.productId,
			quantity: it.quantity,
			price: it.price,
		}))

		const orderRes = await $fetch("/api/orders/orders", {
			method: "POST",
			body: {
				items: itemsPayload,
				...values,
			},
		})

		if (!orderRes?.order?.id) {
			throw new Error("Création de commande impossible")
		}

		const stripeRes = await $fetch("/api/payments/checkout", {
			method: "POST",
			body: {
				cart: detailedItems.value.map((it) => ({
					id: it.productId,
					name: it.name,
					price: it.price,
					quantity: it.quantity,
				})),
				email: values.email,
				orderId: orderRes.order.id,
			},
		})

		if (!stripeRes?.url) {
			throw new Error("Impossible de créer la session de paiement")
		}

		window.location.href = stripeRes.url
	} catch (e: any) {
		errorMessage.value = e?.message || "Une erreur est survenue"
	} finally {
		isSubmitting.value = false
	}
}
</script>
