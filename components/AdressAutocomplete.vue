<!-- components/AddressAutocomplete.vue -->
<template>
  <div class="relative" ref="root" @keydown.down.prevent="onKeyDown(1)" @keydown.up.prevent="onKeyDown(-1)"
    @keydown.esc.prevent="close">
    <input :value="modelValue" @input="handleInput" @focus="onFocus" :placeholder="placeholder || 'Adresse...'"
      autocomplete="address-line1" class="mt-1 block w-full rounded-lg border border-gray-300 bg-white
             px-4 h-10 text-gray-900 placeholder-gray-400
             caret-argan-gold focus:outline-none focus:ring-2
             focus:ring-argan-gold/60 focus:border-argan-gold text-lg" role="combobox"
      :aria-expanded="hasResults ? 'true' : 'false'" aria-autocomplete="list" :aria-controls="listId"
      :aria-activedescendant="activeId" />

    <ul v-if="hasResults" :id="listId" role="listbox"
      class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      <li v-for="(s, i) in results" :key="s.id" :id="`${listId}-opt-${i}`" role="option"
        :aria-selected="i === highlighted ? 'true' : 'false'" @mousedown.prevent="select(s)"
        @mousemove="highlighted = i" class="px-3 py-2 cursor-pointer hover:bg-gray-50"
        :class="{ 'bg-gray-100': i === highlighted }">
        {{ s.label }}
      </li>
    </ul>

    <div v-if="loading" class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">…</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue"
import { useAdresseApi } from "@/server/utils/useAdresseApi"

type SelectedAddress = {
	line1: string
	city: string
	postalCode: string
	country: string
}

const props = defineProps<{
	modelValue: string
	placeholder?: string
	listId?: string
}>()
const emit = defineEmits<{
	"update:modelValue": [value: string]
	select: [addr: SelectedAddress]
}>()

const { query, loading, results, open, highlighted, hasResults, onInput, close, move } =
	useAdresseApi()

const listId = computed(() => props.listId || "adresse-listbox")
const activeId = computed(() =>
	hasResults.value && highlighted.value >= 0
		? `${listId.value}-opt-${highlighted.value}`
		: undefined,
)

const root = ref<HTMLElement | null>(null)

function handleInput(e: Event) {
	const v = (e.target as HTMLInputElement).value
	emit("update:modelValue", v)
	onInput(v)
}

function onFocus() {
	if (props.modelValue?.length >= 3) {
		onInput(props.modelValue)
	}
}

function onKeyDown(delta: number) {
	if (!open.value) onInput(props.modelValue || "")
	move(delta)
}

function select(s: SelectedAddress) {
	emit("update:modelValue", s.line1)
	emit("select", s)
	close()
}

function onClickOutside(ev: MouseEvent) {
	if (!root.value) return
	if (!root.value.contains(ev.target as Node)) close()
}

onMounted(() => document.addEventListener("mousedown", onClickOutside))
onBeforeUnmount(() => document.removeEventListener("mousedown", onClickOutside))

watchEffect(() => {
	query.value = props.modelValue || ""
})

const highlightedRef = highlighted
</script>
