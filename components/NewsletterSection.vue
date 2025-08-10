<template>
  <section class="py-16 bg-argan-light">
    <div class="container mx-auto px-4 max-w-3xl text-center">
      <div class="bg-white rounded-xl p-8 shadow-sm">
        <h2 class="font-serif text-3xl mb-4">L'art de l'argan dans votre boîte mail</h2>
        <p class="text-gray-600 mb-8">
          Recevez nos conseils d'utilisation et offres exclusives
        </p>

        <form @submit.prevent="onSubmit" class="flex flex-col sm:flex-row gap-4">
          <label class="sr-only" for="newsletter-email">Votre adresse email</label>
          <input
            id="newsletter-email"
            type="email"
            v-model="email"
            placeholder="Votre adresse email"
            class="flex-grow px-4 py-3 border border-argan-light rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-argan-gold"
            required
          />

          <button
            type="submit"
            class="bg-argan-gold text-white px-6 py-3 rounded-lg
                   motion-safe:transition-[background-color,color] duration-300
                   hover:bg-argan-dark focus:outline-none focus:ring-2 focus:ring-argan-gold"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const email = ref('')

function onSubmit() {
  if (email.value && email.value.includes('@')) {
    // À brancher côté backend
    console.log('Email submitted:', email.value)
    email.value = ''
  }
}
</script>
