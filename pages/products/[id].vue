<template>
  <section class="max-w-7xl mx-auto py-12 px-4 md:px-8">
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
      <div class="w-12 h-12 border-4 border-argan-gold border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-4 text-argan-dark">Chargement du produit...</p>
    </div>

    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Galerie d'images -->
      <div>
        <div class="bg-argan-light rounded-2xl p-8 mb-6">
          <img :src="selectedImage" :alt="product.name" class="w-full h-96 object-contain" />
        </div>
        <div class="flex gap-4" v-if="product.images && product.images.length > 1">
          <div v-for="img in product.images" :key="img" class="cursor-pointer border-2 rounded-lg overflow-hidden"
            :class="{ 'border-argan-gold': selectedImage === img }" @click="selectedImage = img">
            <img :src="img" alt="Miniature" class="w-16 h-16 object-cover" />
          </div>
        </div>
      </div>

      <!-- Détails produit -->
      <div>
        <span class="bg-argan-gold text-white px-3 py-1 rounded-full text-sm">
          {{ product.category }}
        </span>
        <h1 class="font-serif text-3xl text-argan-dark mt-3 mb-2">{{ product.name }}</h1>
        <p class="text-2xl font-bold text-argan-gold mb-4">
          {{ product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}
        </p>

        <div class="flex items-center mb-4">
          <div class="flex text-yellow-400 mr-2">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
          </div>
          <span class="text-gray-600">(42 avis)</span>
        </div>

        <p class="text-gray-700 mb-6">{{ product.description }}</p>

        <p class="font-medium text-argan-dark mb-2">Disponibilité :
          <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
            {{ product.stock > 0 ? `En stock (${product.stock} unités)` : 'Rupture de stock' }}
          </span>
        </p>

        <div class="border border-argan-light rounded-xl mt-8">
          <div class="border-b border-argan-light">
            <div class="px-6 py-4 font-medium text-argan-dark">Description complète</div>
            <div class="px-6 pb-4 text-gray-700">
              {{ product.details || 'Aucune description détaillée disponible.' }}
            </div>
          </div>
          <div class="border-b border-argan-light">
            <div class="px-6 py-4 font-medium text-argan-dark">Bienfaits</div>
            <div class="px-6 pb-4">
              <ul class="list-disc pl-5 text-gray-700">
                <li v-for="b in product.benefits || ['Aucun bienfait spécifié']" :key="b">{{ b }}</li>
              </ul>
            </div>
          </div>
          <div>
            <div class="px-6 py-4 font-medium text-argan-dark">Utilisation</div>
            <div class="px-6 pb-4 text-gray-700">
              {{ product.usage || 'Aucune information d\'utilisation disponible.' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Produit introuvable -->
    <div v-else class="flex flex-col items-center justify-center py-24">
      <i class="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
      <h2 class="font-serif text-2xl text-argan-dark mb-2">Produit introuvable</h2>
      <p class="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
      <NuxtLink to="/products"
        class="inline-block bg-argan-gold hover:bg-argan-dark text-white px-6 py-3 rounded-full transition">
        Voir tous nos produits
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '~/stores/products'

const route = useRoute()
const productsStore = useProductsStore()
const isLoading = ref(true)
const selectedImage = ref<string | undefined>()

const product = computed(() => {
  return productsStore.products.find(p => p.id === route.params.id)
})

onMounted(async () => {
  await productsStore.fetchProducts()
  updateSelectedImage()
  isLoading.value = false
})

watch(() => route.params.id, () => {
  updateSelectedImage()
})

function updateSelectedImage() {
  if (product.value) {
    selectedImage.value = product.value.images?.[0] || product.value.image
  } else {
    selectedImage.value = undefined
  }
}
</script>
