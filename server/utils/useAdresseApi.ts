// composables/useAdresseApi.ts
import { ref, watch, computed } from "vue"

type Suggestion = {
	id: string
	label: string
	line1: string // numéro + rue
	city: string
	postalCode: string
	country: string // 'France'
}

export function useAdresseApi() {
	const query = ref("")
	const loading = ref(false)
	const error = ref<string | null>(null)
	const results = ref<Suggestion[]>([])
	const open = ref(false)
	const highlighted = ref(-1)

	let debounceId: any = null

	async function fetchSuggestions(q: string) {
		if (!q || q.trim().length < 3) {
			results.value = []
			return
		}
		loading.value = true
		error.value = null
		try {
			const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&autocomplete=1&limit=5`
			const res = await fetch(url)
			const data = await res.json()

			results.value = (data?.features ?? []).map((f: any) => {
				const p = f.properties || {}
				const housenumber = p.housenumber || ""
				const street = p.street || p.name || ""
				const line1 = [housenumber, street].filter(Boolean).join(" ").trim() || p.label || ""
				const city = p.city || p.locality || p.name || ""
				const postal = p.postcode || ""
				return {
					id: f.geometry?.coordinates?.join(",") || p.id || p.label,
					label: p.label || line1,
					line1,
					city,
					postalCode: postal,
					country: "France",
				} as Suggestion
			})
		} catch (e: any) {
			error.value = e?.message || "Erreur réseau"
			results.value = []
		} finally {
			loading.value = false
		}
	}

	function onInput(q: string) {
		query.value = q
		open.value = true
		highlighted.value = -1
		if (debounceId) clearTimeout(debounceId)
		debounceId = setTimeout(() => fetchSuggestions(q), 250)
	}

	function close() {
		open.value = false
		highlighted.value = -1
	}

	function move(delta: number) {
		if (!results.value.length) return
		highlighted.value = (highlighted.value + delta + results.value.length) % results.value.length
	}

	const hasResults = computed(() => open.value && results.value.length > 0)

	return {
		// state
		query,
		loading,
		error,
		results,
		open,
		highlighted,
		hasResults,
		// actions
		onInput,
		fetchSuggestions,
		close,
		move,
	}
}
