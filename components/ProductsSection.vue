<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="font-serif text-3xl md:text-4xl mb-4">Notre sélection d'exception</h2>
        <p class="text-gray-600">
          Découvrez l'huile d'argan sous ses formes les plus pures
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="product in products" :key="product.name"
          class="border border-argan-light rounded-xl overflow-hidden transition-transform hover:scale-[1.02]">
          <img :src="product.image" :alt="product.name" class="w-full h-64 object-cover" />
          <div class="p-6">
            <h3 class="font-serif text-xl mb-2">{{ product.name }}</h3>
            <p class="text-gray-600 mb-4">{{ product.description }}</p>
            <div class="flex justify-between items-center">
              <span class="font-semibold text-argan-gold">{{ product.price }}</span>
              <button class="text-argan-gold hover:text-argan-dark flex items-center">
                Découvrir
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-12">
        <button
          class="border border-argan-gold text-argan-gold hover:bg-argan-gold hover:text-white px-8 py-3 rounded-full transition duration-300">
          Voir toute la gamme
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const products = [
  {
    name: "Argan Cosmétique",
    description: "Pour une peau nourrie et des cheveux revitalisés",
    price: "À partir de 24€",
    image: "/images/asset_1.jpg"
  },
  {
    name: "Argan Culinaire",
    description: "L'huile gourmande aux notes de noisette",
    price: "À partir de 28€",
    image: "/images/asset_2.jpg"
  },
  {
    name: "Collection Prestige",
    description: "L'huile d'argan la plus rare et la plus pure",
    price: "À partir de 42€",
    image: "/images/asset_3.jpg"
  }
]
</script>
