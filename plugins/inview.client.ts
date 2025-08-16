export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('inview', {
    mounted(el, binding) {
      el.dataset.inview = 'false'
      const once = binding.value?.once ?? true
      const rootMargin = binding.value?.rootMargin ?? '0px 0px -10% 0px'
      const threshold = binding.value?.threshold ?? 0.15

      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.inview = 'true'
          if (once) io.unobserve(el)
        } else if (!once) {
          el.dataset.inview = 'false'
        }
      }, { rootMargin, threshold })

      io.observe(el)
      // @ts-ignore
      el.__io = io
    },
    beforeUnmount(el: any) {
      el.__io?.disconnect?.()
    }
  })
})
