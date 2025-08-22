<template>
  <nav class="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between sticky top-0 z-50">
    <!-- Logo -->
    <NuxtLink to="/" class="flex items-center gap-2 cursor-pointer hover:underline hover:text-argan-gold">
      <NuxtImg src="logo.png" alt="Logo" class="h-8 w-8 rounded-full" provider="cloudinary" />
      <span class="text-xl font-bold text-primary">Argan d'ici</span>
    </NuxtLink>
    <!-- Desktop menu -->
    <ul class="hidden md:flex gap-6 items-center font-medium cursor-pointer">
      <li>
        <NuxtLink to="/" exact-active-class="text-primary"
          class="hover:text-secondary hover:underline hover:text-argan-gold transition">Accueil</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/products" exact-active-class="text-primary"
          class="hover:text-secondary hover:underline hover:text-argan-gold transition">Produits</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/faq" exact-active-class="text-primary"
          class="hover:text-secondary hover:underline hover:text-argan-gold transition">FAQ</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/about" exact-active-class="text-primary"
          class="hover:text-secondary hover:underline hover:text-argan-gold transition">Qui sommes-nous</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/contact" exact-active-class="text-primary"
          class="hover:text-secondary hover:underline hover:text-argan-gold transition">Contact</NuxtLink>
      </li>
    </ul>
    <!-- Cart Icon -->
    <NuxtLink to="/cart" class="relative hover:text-argan-gold transition ml-4 md:ml-0" aria-label="Panier">
      <i class="fas fa-shopping-cart text-xl"></i>
      <ClientOnly>
        <span v-if="count > 0"
          class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full">
          {{ count }}
        </span>
      </ClientOnly>
    </NuxtLink>
    <!-- Mobile menu button -->
    <button @click="toggleMenu" class="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="Menu">
      <span v-if="!menuOpen">☰</span>
      <span v-else>✕</span>
    </button>
    <!-- Mobile menu -->
    <ul v-if="menuOpen" class="absolute left-0 top-full w-full bg-white shadow-lg md:hidden flex flex-col py-2 z-50">
      <li>
        <NuxtLink @click="closeMenu" to="/" class="block px-4 py-2 hover:text-secondary">Accueil</NuxtLink>
      </li>
      <li>
        <NuxtLink @click="closeMenu" to="/products" class="block px-4 py-2 hover:text-secondary">Produits</NuxtLink>
      </li>
      <li>
        <NuxtLink @click="closeMenu" to="/faq" class="block px-4 py-2 hover:text-secondary">FAQ</NuxtLink>
      </li>
      <li>
        <NuxtLink @click="closeMenu" to="/about" class="block px-4 py-2 hover:text-secondary">Qui sommes-nous</NuxtLink>
      </li>
      <li>
        <NuxtLink @click="closeMenu" to="/contact" class="block px-4 py-2 hover:text-secondary">Contact</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '~/stores/cart' // ajuste le chemin si besoin

// Menu mobile
const menuOpen = ref(false)
function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu() { menuOpen.value = false }

// Panier (Pinia)
const cart = useCartStore()
const { count } = storeToRefs(cart) // getter réactif
</script>
