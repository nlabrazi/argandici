<template>
  <section class="py-16 bg-argan-light">
    <div class="container mx-auto px-4 max-w-3xl text-center">
      <div v-inview class="reveal reveal-up bg-white rounded-xl p-8 shadow-sm">
        <h2 class="font-serif text-3xl mb-4">L'art de l'argan dans votre boîte mail</h2>
        <p class="text-gray-600 mb-8">
          Recevez nos conseils d'utilisation et offres exclusives
        </p>
        <form @submit.prevent="onSubmit" class="flex flex-col sm:flex-row gap-4">
          <input type="email" placeholder="Votre adresse email" v-model="email"
            class="flex-grow px-4 py-3 border border-argan-light rounded-lg focus:outline-none focus:ring-2 focus:ring-argan-gold"
            required>
          <button type="submit"
            class="bg-argan-gold hover:bg-argan-dark text-white px-6 py-3 rounded-lg transition duration-300">
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
    console.log('Email submitted:', email.value)
    email.value = ''
  }
}
</script>
