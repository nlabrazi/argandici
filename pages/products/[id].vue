<template>
  <section class="max-w-7xl mx-auto py-12 px-4 md:px-8">

    <!-- Retour -->
    <NuxtLink to="/products"
      class="inline-flex items-center gap-2 text-argan-gold hover:text-argan-dark font-medium mb-8 transition"
      v-if="!isLoading">
      <i class="fas fa-arrow-left"></i>
      Retour aux produits
    </NuxtLink>

    <!-- Loader -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
      <div class="w-12 h-12 border-4 border-argan-gold border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-4 text-argan-dark">Chargement du produit...</p>
    </div>

    <!-- Page Produit -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Galerie d'images -->
      <div>
        <div v-inview class="reveal reveal-left bg-argan-light rounded-2xl p-8 mb-6">
          <NuxtImg :src="selectedImage" :alt="product.name" class="w-full h-96 object-contain" provider="cloudinary" />
        </div>
        <div class="flex gap-4" v-if="product.images && product.images.length > 1">
          <div v-for="img in product.images" :key="img" class="cursor-pointer border-2 rounded-lg overflow-hidden"
            :class="{ 'border-argan-gold': selectedImage === img }" @click="selectedImage = img">
            <NuxtImg :src="img" alt="Miniature" class="w-16 h-16 object-cover" provider="cloudinary" />
          </div>
        </div>
      </div>

      <!-- Détails produit + Add to cart -->
      <div v-inview class="reveal reveal-right">
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

        <!-- Add to cart section -->
        <div v-if="product.stock > 0" class="mb-8 flex items-center gap-6">
          <div class="flex items-center border border-gray-300 rounded-full">
            <button class="px-4 py-2 text-gray-600 hover:text-argan-gold" @click="decreaseQuantity"
              :disabled="quantity <= 1">
              <i class="fas fa-minus"></i>
            </button>
            <span class="px-4 py-2 font-medium">{{ quantity }}</span>
            <button class="px-4 py-2 text-gray-600 hover:text-argan-gold" @click="increaseQuantity"
              :disabled="quantity >= product.stock">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <button
            class="bg-argan-gold hover:bg-argan-dark text-white py-3 px-6 rounded-full cursor-pointer font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="addToCart" :disabled="quantity < 1 || quantity > product.stock || addingToCart">
            <span v-if="!addingToCart"><i class="fas fa-shopping-cart mr-2"></i> Ajouter au panier</span>
            <span v-else><i class="fas fa-spinner fa-spin mr-2"></i> Ajout...</span>
          </button>
        </div>
        <div v-else class="mb-8 text-red-600 font-medium">Ce produit est actuellement indisponible.</div>

        <!-- Infos détaillées -->
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
              {{ product.usage || "Aucune information d'utilisation disponible." }}
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
import { useCartStore } from '~/stores/cart'
import { useNotificationStore } from '~/stores/notifications'

const route = useRoute()
const productsStore = useProductsStore()
const cart = useCartStore()
const notifications = useNotificationStore()
const isLoading = ref(true)
const selectedImage = ref<string | undefined>()
const quantity = ref(1)
const addingToCart = ref(false)

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
    quantity.value = 1
  } else {
    selectedImage.value = undefined
    quantity.value = 1
  }
}

function increaseQuantity() {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

async function addToCart() {
  if (!product.value || quantity.value < 1) return
  addingToCart.value = true
  // Appelle ton store/cart ici selon API de ton store
  cart.addToCart({
    productId: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
  }, quantity.value)
  notifications.showToast('Produit ajouté au panier !', 'success')
  setTimeout(() => { addingToCart.value = false }, 1000)
}
</script>
