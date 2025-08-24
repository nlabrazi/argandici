// stores/products.ts
import { defineStore } from "pinia"

export interface Product {
	id: string
	name: string
	description: string
	price: number
	category: string
	image: string
	stock: number
	// Optionnel si tu ajoutes ça en BDD plus tard :
	images?: string[]
	details?: string
	benefits?: string[]
	usage?: string
	createdAt?: string
}

export const useProductsStore = defineStore("products", {
	state: () => ({
		products: [] as Product[],
		loading: false,
		loaded: false,
		error: null as string | null,
	}),
	actions: {
		async fetchProducts(force = false) {
			if (this.loaded && !force) return
			this.loading = true
			this.error = null
			try {
				const data = await $fetch<Product[]>("/api/products")
				this.products = data
				this.loaded = true
			} catch (e: any) {
				this.error = e?.message || "Erreur de chargement des produits"
			} finally {
				this.loading = false
			}
		},
		getById(id: string) {
			return this.products.find((p) => p.id === id)
		},
	},
})
