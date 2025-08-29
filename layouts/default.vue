<template>
  <div>
    <SiteNavbar />
    <main>
      <slot />
    </main>
    <SiteFooter />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import SiteNavbar from "@/components/SiteNavbar.vue"
import SiteFooter from "@/components/SiteFooter.vue"
import ToastContainer from "@/components/ToastContainer.vue"
</script>
