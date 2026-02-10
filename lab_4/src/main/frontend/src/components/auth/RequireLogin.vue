<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.replace('/')
  }
})
</script>

<template>
  <router-view v-if="!authStore.isAuthenticated" />
</template>