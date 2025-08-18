<template>
  <section class="max-w-3xl mx-auto py-12 px-4 md:px-8 text-center">
    <div class="mb-8">
      <h1 class="text-3xl font-serif text-red-700">Paiement annulé ❌</h1>
      <p class="text-gray-600 mt-2">
        Votre paiement n’a pas été finalisé.<br />
        Vous pouvez réessayer ou modifier votre commande.
      </p>
    </div>

    <div class="space-y-4">
      <NuxtLink to="/cart"
        class="inline-block bg-argan-gold hover:bg-argan-dark text-white px-6 py-3 rounded-full transition">
        Retourner à mon panier
      </NuxtLink>

      <NuxtLink to="/products" class="block underline text-argan-dark">
        Continuer mes achats
      </NuxtLink>
    </div>

    <div class="mt-12 text-sm text-gray-500">
      <p>
        Si vous pensez qu’il s’agit d’une erreur, contactez-nous à
        <a href="mailto:contact@argandici.com" class="underline">contact@argandici.com</a>.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
// Pas de logique complexe ici, c’est une page purement informative.
// On peut ajouter un clearCart() si besoin, mais Stripe ne débite pas en cas d'annulation.
</script>
