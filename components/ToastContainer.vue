<template>
  <div class="fixed top-4 right-4 z-50 space-y-3">
    <div v-for="toast in notifications.toasts" :key="toast.id" :class="[
      'flex items-center gap-3 px-5 py-3 rounded shadow-lg',
      toast.type === 'success' ? 'bg-green-500 text-white' :
        toast.type === 'error' ? 'bg-red-500 text-white' :
          toast.type === 'warning' ? 'bg-yellow-400 text-black' :
            'bg-gray-800 text-white'
    ]">
      <span>{{ toast.message }}</span>
      <button @click="notifications.removeToast(toast.id)" class="ml-3 font-bold hover:opacity-60">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications'
const notifications = useNotificationStore()
</script>
