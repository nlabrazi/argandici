export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive("inview", {
		getSSRProps() {
			return {}
		},
	})
})
