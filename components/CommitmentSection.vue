<template>
  <section class="py-20 bg-argan-dark text-white">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 mb-12 md:mb-0">
          <h2 class="font-serif text-3xl md:text-4xl mb-6">Un engagement durable</h2>
          <p v-inview class="reveal reveal-right mb-6 text-argan-light">
            Argan d'ici s'engage à soutenir les coopératives marocaines locales et à favoriser le circuit court.<br />
            Nous garantissons un commerce équitable et une rémunération juste pour les producteurs.<br />
            Nos produits sont certifiés biologiques et équitables, contribuant activement à la préservation de
            l'environnement et au bien-être des communautés
          </p>
          <div class="flex items-center space-x-4">
            <NuxtImg src="logo_usda-organic.png" alt="Certification commerce équitable" class="h-16 w-auto" height="64"
              provider="cloudinary" />
            <NuxtImg src="logo_ecocert.svg" alt="Certification biologique" class="h-16 w-auto" provider="cloudinary" />
          </div>
        </div>
        <div class="md:w-1/2 md:pl-16">
          <div v-inview class="reveal reveal-right bg-argan-gold/10 p-8 rounded-xl">
            <blockquote class="font-serif text-2xl italic mb-6">
              "Chez Argan d'ici, nous croyons que la beauté véritable naît du respect
              des hommes et de la nature"
            </blockquote>
            <div class="flex items-center">
              <NuxtImg src="avatar_f.png" alt="Fatima Zahra" class="w-12 h-12 rounded-full mr-4"
                provider="cloudinary" />
              <div>
                <p class="font-semibold">Fatima Zahra</p>
                <p class="text-argan-light">Fondatrice de la coopérative partenaire</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
