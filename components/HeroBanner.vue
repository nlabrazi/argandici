<template>
  <section class="relative h-[80vh] bg-gray-200">
    <div class="absolute inset-0">
      <NuxtImg src="hero3.jpg" alt="Huile d'argan maroc" class="w-full h-full object-cover"
        provider="cloudinary" style="position: absolute; inset: 0;" aria-hidden="true" draggable="false" />
      <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <div class="relative h-full flex items-center">
      <div class="container mx-auto px-4 max-w-3xl text-center">
        <h1 class="font-serif text-5xl md:text-7xl text-white mb-6">
          <span class="block">L'OR VÉGÉTAL</span>
          <span class="block text-argan-gold">DU MAROC</span>
        </h1>
        <p class="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Pur comme là-bas, authentique comme ici. Découvrez notre huile d'argan
          importée directement des coopératives marocaines.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <NuxtLink to="/products"
            class="bg-argan-gold hover:bg-argan-dark text-white px-8 py-3 rounded-full transition duration-300">
            Découvrir la collection
          </NuxtLink>
          <NuxtLink to="/about"
            class="border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-full transition duration-300">
            Notre histoire
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
