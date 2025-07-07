<template>
  <footer class="bg-accent text-secondary py-6 px-4 mt-8 border-b border-gray-200">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="text-center md:text-left">
        <span class="font-semibold">© {{ currentYear }} Argan d'ici.</span>
        <span class="ml-2">Tous droits réservés.</span>
      </div>
      <div class="flex gap-4 text-sm cursor-pointer">
        <NuxtLink to="/legal-notice" class="hover:underline hover:text-argan-gold transition duration-300">Mentions
          légales</NuxtLink>
        <NuxtLink to="/terms-of-sale" class="hover:underline hover:text-argan-gold transition duration-300">CGV
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
