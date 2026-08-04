<template>
  <div v-if="!isAllowed" class="flex items-center justify-center h-96">
    <div class="text-center">
      <div class="text-6xl mb-4">🔒</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
      <p class="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  allowed: {
    type: Boolean,
    default: true
  }
})

const isAllowed = computed(() => props.allowed)
</script>
