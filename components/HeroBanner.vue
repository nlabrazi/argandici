<template>
  <section class="relative h-[80vh] bg-gray-200">
    <!-- Calque image (sous le contenu) -->
<NuxtImg
  src="hero3.jpg"
  provider="cloudinary"
  alt="Huile d'argan maroc herobanner"
  placeholder="empty"
  class="absolute inset-0 h-full w-full object-cover z-0"
  sizes="sm:100vw md:100vw lg:100vw xl:100vw 2xl:100vw"
/>
    <!-- Overlay sombre, au-dessus de l'image -->
    <div class="absolute inset-0 bg-black/40 z-[1]"></div>

    <!-- Contenu au-dessus de tout -->
    <div class="relative z-[2] h-full flex items-center">
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
          <NuxtLink
            to="/products"
            class="bg-argan-gold text-white px-8 py-3 rounded-full
                   motion-safe:transition-[background-color,color] duration-300
                   hover:bg-argan-dark focus:outline-none focus:ring-2 focus:ring-argan-gold">
            Découvrir la collection
          </NuxtLink>

          <NuxtLink
            to="/about"
            class="border-2 border-white text-white px-8 py-3 rounded-full
                   motion-safe:transition-[background-color,border-color,color] duration-300
                   hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-argan-gold">
            Notre histoire
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
