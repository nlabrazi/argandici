<template>
  <section class="max-w-7xl mx-auto py-16 px-4 md:px-8 bg-[#fafafa]">
    <!-- Header -->
    <div class="text-center mb-16">
      <div class="text-argan-gold font-sans uppercase tracking-wider mb-2">Questions fréquentes</div>
      <h1 class="text-3xl md:text-4xl font-serif font-bold text-argan-dark mb-4">
        Foire aux questions
      </h1>
      <p class="max-w-2xl mx-auto text-gray-600">
        Trouvez les réponses aux questions les plus courantes sur notre huile d'argan,
        nos procédés de fabrication et nos engagements.
      </p>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Col gauche : FAQ -->
      <div class="order-2 lg:order-1">
        <div class="space-y-6">
          <div
            v-for="(item, i) in faqList"
            :key="i"
            class="border border-argan-light rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md"
          >
            <!-- Bouton -->
            <button
              @click="toggle(i)"
              class="w-full flex justify-between items-center px-6 py-5 bg-white text-left hover:bg-argan-light/30
                     transition-colors focus:outline-none focus:ring-2 focus:ring-argan-gold"
              :aria-expanded="openIndex === i"
              :aria-controls="`faq-panel-${i}`"
            >
              <span class="font-medium text-argan-dark text-lg">{{ item.question }}</span>

              <!-- Chevron -->
              <span
                class="transform transition-[transform] text-argan-gold"
                :class="{ 'rotate-180': openIndex === i }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                </svg>
              </span>
            </button>

            <!-- Panneau (modèle grid 0fr -> 1fr) -->
            <div
              :id="`faq-panel-${i}`"
              class="grid motion-safe:transition-[grid-template-rows,opacity] duration-300 ease-in-out"
              :class="openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
            >
              <div class="overflow-hidden">
                <div class="px-6 py-5 bg-argan-light text-argan-dark border-t border-argan-light">
                  {{ item.answer }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Col droite : visuel -->
      <div class="order-1 lg:order-2 flex items-center">
        <div class="bg-argan-light rounded-2xl p-8 h-full w-full">
          <NuxtImg
            src="asset_2.jpg"
            alt="Illustration huile d'argan"
            class="w-full h-full object-cover rounded-xl"
            provider="cloudinary"
          />
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="mt-16 text-center">
      <h3 class="font-serif text-xl text-argan-dark mb-4">Vous avez d'autres questions ?</h3>
      <p class="mb-6 max-w-xl mx-auto text-gray-600">
        Contactez-nous directement et notre équipe vous répondra dans les plus brefs délais.
      </p>
      <NuxtLink
        to="/contact"
        class="inline-block bg-argan-gold hover:bg-argan-dark text-white px-8 py-3 rounded-full transition-[background-color]
               duration-300"
      >
        Nous contacter
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type FaqItem = { question: string; answer: string }

const faqList: FaqItem[] = [
  {
    question: "Qu'est-ce que l'huile d'argan ?",
    answer:
      "L'huile d'argan est une huile végétale précieuse, extraite des fruits de l'arganier, reconnue pour ses bienfaits alimentaires et cosmétiques. Elle est produite exclusivement au Maroc et est souvent appelée 'l'or liquide' en raison de sa valeur et de sa couleur dorée.",
  },
  {
    question: "Comment garantissez-vous la qualité de l'huile ?",
    answer:
      "Notre huile est produite de façon artisanale, contrôlée à chaque étape et testée en laboratoire. Nous sélectionnons les meilleurs producteurs familiaux au Maroc. Chaque lot est analysé pour garantir sa pureté et son absence de contaminants.",
  },
  {
    question: "Livrez-vous partout en France ?",
    answer:
      "Oui, nous livrons partout en France métropolitaine via Colissimo ou Mondial Relay. Les délais de livraison sont généralement de 2 à 5 jours ouvrés. Les frais de port sont offerts à partir de 50€ d'achat.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Nous acceptons Carte bancaire, Apple Pay, Google Pay et Paypal via notre module de paiement sécurisé. Toutes les transactions sont cryptées pour assurer la sécurité de vos données.",
  },
  {
    question: "Comment vous contacter ?",
    answer:
      "Vous pouvez nous joindre via le formulaire de contact ou par email à contact@argandici.com. Notre équipe vous répondra dans les 24 heures ouvrées. Nous sommes également disponibles par téléphone au 01 23 45 67 89 du lundi au vendredi de 9h à 18h.",
  },
  {
    question: "L'huile d'argan est-elle comestible ?",
    answer:
      "Non, pour le moment nous ne proposons qu'une seule qualité d'huile d'argan : cosmétique. L'huile alimentaire est torréfiée et possède un délicieux goût de noisette. Elle est idéale pour assaisonner vos plats. Suivez-nous sur nos réseaux sociaux pour être informé de son arrivée !",
  },
  {
    question: "Quelle est la différence entre l'huile cosmétique et alimentaire ?",
    answer:
      "L'huile cosmétique est pressée à froid à partir d'amandons non torréfiés, ce qui préserve ses propriétés pour la peau et les cheveux. L'huile alimentaire est obtenue à partir d'amandons légèrement torréfiés, ce qui lui donne son goût caractéristique et la rend comestible.",
  },
]

const openIndex = ref<number | null>(null)
function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>
