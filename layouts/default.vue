<template>
  <div class="min-h-screen flex flex-col">
    <SiteNavbar />
    <main class="flex-1">
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
