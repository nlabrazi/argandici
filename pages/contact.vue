<template>
  <section class="max-w-7xl mx-auto my-section px-4 md:px-8">
    <div class="text-center mb-section">
      <div class="text-argan-gold font-sans uppercase tracking-wider mb-2">Nous contacter</div>
      <h1 class="text-3xl md:text-4xl font-serif font-bold text-argan-dark mb-4">
        Contactez-nous
      </h1>
      <p class="max-w-2xl mx-auto text-gray-600">
        Une question, un renseignement ? Notre équipe est à votre écoute.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Formulaire de contact -->
      <div class="bg-white rounded-2xl shadow-sm p-8">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <div>
            <label for="name" class="block mb-2 text-sm font-medium text-argan-dark">Nom complet</label>
            <input type="text" id="name" v-model="form.name" :class="inputClass(errors.name)" placeholder="Votre nom"
              required />
            <FormError v-if="errors.name" :error="errors.name" />
          </div>

          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-argan-dark">Email</label>
            <input type="email" id="email" v-model="form.email" :class="inputClass(errors.email)"
              placeholder="votre@email.com" required />
            <FormError v-if="errors.email" :error="errors.email" />
          </div>

          <div>
            <label for="subject" class="block mb-2 text-sm font-medium text-argan-dark">Sujet</label>
            <select id="subject" v-model="form.subject" :class="inputClass(errors.subject)" required>
              <option value="" disabled selected>Sélectionnez un sujet</option>
              <option value="Commande">Question sur une commande</option>
              <option value="Produit">Information sur un produit</option>
              <option value="Livraison">Question sur la livraison</option>
              <option value="Partenaire">Devenir partenaire</option>
              <option value="Autre">Autre demande</option>
            </select>
            <FormError v-if="errors.subject" :error="errors.subject" />
          </div>

          <div>
            <label for="message" class="block mb-2 text-sm font-medium text-argan-dark">Message</label>
            <textarea id="message" v-model="form.message" rows="6" :class="inputClass(errors.message)"
              placeholder="Votre message..." required></textarea>
            <FormError v-if="errors.message" :error="errors.message" />
          </div>

          <button type="submit" :disabled="loading"
            class="w-full bg-argan-gold hover:bg-argan-dark text-white font-medium py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="!loading">Envoyer le message</span>
            <span v-else>Envoi en cours...</span>
          </button>

          <div v-if="success" class="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
            Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
          </div>
          <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            Une erreur s'est produite. Veuillez réessayer ou nous contacter directement par email.
          </div>
        </form>
      </div>

      <!-- Informations de contact et carte -->
      <div class="space-y-8">
        <!-- ... (reprendre ton HTML infos, carte Google Maps, réseaux sociaux) ... -->
        <!-- Coller ici le code contact + réseaux + Google Map déjà fourni -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref(false)
const errors = reactive<{ [key: string]: string }>({})

function validate() {
  errors.name = !form.name || form.name.length < 2 ? 'Nom requis (2 caractères min.)' : ''
  errors.email = !form.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email) ? 'Email valide requis' : ''
  errors.subject = !form.subject ? 'Sujet requis' : ''
  errors.message = !form.message || form.message.length < 10 ? 'Message trop court' : ''
  return !Object.values(errors).some(Boolean)
}

async function onSubmit() {
  if (!validate()) return
  loading.value = true
  success.value = false
  error.value = false

  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...form } })
    Object.keys(form).forEach((k) => {
      (form as any)[k] = ''
    })

    success.value = true
    setTimeout(() => (success.value = false), 4000)
  } catch (e) {
    error.value = true
  } finally {
    loading.value = false
  }
}

function inputClass(err: string | undefined) {
  return [
    "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-argan-gold focus:border-transparent",
    err ? "border-red-400 ring-red-100" : "border-argan-light"
  ]
}
</script>

<script lang="ts">
export default {
  components: {
    FormError: {
      props: { error: String },
      template: `<div class="mt-1 text-sm text-red-500">{{ error }}</div>`
    }
  }
}
</script>
