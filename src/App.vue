<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function redirectToLogin() {
  if (router.currentRoute.value.path !== '/login') {
    router.replace('/login')
  }
}

onMounted(() => {
  window.addEventListener('session-expired', redirectToLogin)
})

onBeforeUnmount(() => {
  window.removeEventListener('session-expired', redirectToLogin)
})
</script>

<style>
</style>
