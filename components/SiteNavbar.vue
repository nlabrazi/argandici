<template>
  <nav class="bg-white border-b border-gray-200 px-4 py-2 sticky top-0 z-50">
    <!-- Desktop layout -->
    <div class="hidden md:flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 cursor-pointer hover:underline hover:text-argan-gold">
        <NuxtImg src="logo.png" alt="Argan d'ici" class="h-8 w-8 rounded-full" provider="cloudinary" />
        <span class="text-xl font-bold text-primary">Argan d'ici</span>
      </NuxtLink>

      <!-- Menu desktop -->
      <ul class="flex gap-6 items-center font-medium mx-auto">
        <li>
          <NuxtLink to="/" exact-active-class="text-primary" class="hover:text-argan-gold hover:underline transition">
            Accueil</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/products" exact-active-class="text-primary"
            class="hover:text-argan-gold hover:underline transition">Produits</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/faq" exact-active-class="text-primary"
            class="hover:text-argan-gold hover:underline transition">FAQ</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about" exact-active-class="text-primary"
            class="hover:text-argan-gold hover:underline transition">Qui sommes-nous</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/contact" exact-active-class="text-primary"
            class="hover:text-argan-gold hover:underline transition">Contact</NuxtLink>
        </li>
      </ul>

      <!-- Cart desktop (à droite) -->
      <NuxtLink to="/cart" class="relative hover:text-argan-gold transition" aria-label="Panier">
        <i class="fas fa-shopping-cart text-xl"></i>
        <span v-if="count > 0"
          class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full">
          {{ count }}
        </span>
      </NuxtLink>
    </div>

    <!-- Mobile layout -->
    <div class="grid grid-cols-3 items-center md:hidden">
      <!-- Burger -->
      <button @click="toggleMenu"
        class="justify-self-start p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
        aria-label="Ouvrir le menu">
        <span v-if="!menuOpen">☰</span>
        <span v-else>✕</span>
      </button>

      <!-- Logo centré -->
      <NuxtLink to="/" class="justify-self-center">
        <NuxtImg src="logo.png" alt="Argan d'ici" class="h-8 w-8 rounded-full" provider="cloudinary" />
      </NuxtLink>

      <!-- Cart à droite -->
      <NuxtLink to="/cart" class="justify-self-end relative hover:text-argan-gold transition" aria-label="Panier">
        <i class="fas fa-shopping-cart text-xl"></i>
        <span v-if="count > 0"
          class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full">
          {{ count }}
        </span>
      </NuxtLink>
    </div>

    <!-- Menu mobile déroulant -->
    <transition name="fade">
      <ul v-if="menuOpen"
        class="md:hidden mt-2 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 z-50 relative">
        <li v-for="(item, i) in mobileItems" :key="item.to">
          <NuxtLink :to="item.to" @click="closeMenu" @pointerdown="pressedIndex = i" @pointerup="pressedIndex = null"
            @pointercancel="pressedIndex = null" @pointerleave="pressedIndex = null"
            class="block px-4 py-3 transition-colors touch-manipulation"
            :class="pressedIndex === i ? 'bg-argan-light/60' : ''">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { storeToRefs } from "pinia"
import { useRoute } from "vue-router"
import { useCartStore } from "~/stores/cart"

const mobileItems = [
  { to: '/', label: 'Accueil' },
  { to: '/products', label: 'Produits' },
  { to: '/faq', label: 'FAQ' },
  { to: '/about', label: 'Qui sommes-nous' },
  { to: '/contact', label: 'Contact' },
]

const pressedIndex = ref<number | null>(null)

const menuOpen = ref(false)
function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu() { menuOpen.value = false }

const route = useRoute()
watch(() => route.fullPath, () => (menuOpen.value = false))

const cart = useCartStore()
const { count } = storeToRefs(cart)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .15s ease
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0
}

.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
</style>
