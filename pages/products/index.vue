<template>
  <section class="max-w-7xl mx-auto py-12 px-4 md:px-8">
    <div class="text-center mb-16">
      <h1 class="font-serif text-4xl text-argan-dark mb-4">Notre sélection d'huile d'argan</h1>
      <p class="max-w-2xl mx-auto text-gray-600">
        Découvrez notre gamme d'huiles d'argan 100% pures, pressées à froid et importées directement du Maroc.
      </p>
    </div>

    <!-- Filtres par catégorie -->
    <div class="flex flex-wrap justify-center gap-4 mb-12">
      <button v-for="category in categories" :key="category" :class="[
        'px-6 py-2 rounded-full transition-colors',
        selectedCategory === category
          ? 'bg-argan-gold text-white'
          : 'bg-argan-light text-argan-dark hover:bg-argan-gold/20'
      ]" @click="filterByCategory(category)">
        {{ category }}
      </button>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="w-12 h-12 border-4 border-argan-gold border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Liste produits -->
    <div v-if="!isLoading && filteredProducts.length" v-inview
      class="reveal reveal-down grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="product in filteredProducts" :key="product.id" :to="`/products/${product.id}`"
        class="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer group">
        <div class="relative">
          <NuxtImg :src="product.image" :alt="product.name" class="w-full h-64 object-cover" provider="cloudinary" />
          <div v-if="product.stock === 0"
            class="absolute top-4 right-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
            Rupture de stock
          </div>
          <div v-else-if="product.stock > 0 && product.stock < 10"
            class="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            Bientôt épuisé
          </div>
        </div>

        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <h2 class="font-serif text-xl text-argan-dark group-hover:text-argan-gold transition">{{ product.name }}
            </h2>
            <span class="font-bold text-argan-gold text-lg">
              {{ product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}
            </span>
          </div>
          <p class="text-gray-600 mb-4 text-sm">{{ product.description }}</p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">
              {{ product.stock > 0 ? product.stock + ' en stock' : 'Indisponible' }}
            </span>
            <span class="bg-argan-gold/80 text-white px-4 py-2 rounded-full text-xs"
              v-if="product.stock > 0">Voir</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Aucun produit -->
    <div v-if="!isLoading && !filteredProducts.length" class="text-center py-16">
      <i class="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
      <h3 class="font-serif text-xl text-argan-dark mb-2">Aucun produit trouvé</h3>
      <p class="text-gray-600 max-w-md mx-auto">
        Nous n'avons trouvé aucun produit dans cette catégorie. Essayez une autre catégorie ou revenez plus tard.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '~/stores/products'

const categories = ['Tous', 'Cosmétique', 'Alimentaire', 'Soins']
const selectedCategory = ref('Tous')
const isLoading = ref(true)

const productsStore = useProductsStore()
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'Tous') return productsStore.products
  return productsStore.products.filter(p => p.category === selectedCategory.value)
})

function filterByCategory(category: string) {
  selectedCategory.value = category
}

onMounted(async () => {
  await productsStore.fetchProducts()
  isLoading.value = false
})
</script>
