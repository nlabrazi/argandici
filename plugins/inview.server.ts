export default defineNuxtPlugin((nuxtApp) => {
  // Stub SSR : expose la directive pour éviter l'erreur pendant le rendu serveur
  nuxtApp.vueApp.directive('inview', {
    // Cette méthode est lue par le renderer SSR
    getSSRProps() {
      return {};
    }
  });
});
