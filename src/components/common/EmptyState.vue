<template>
  <div class="flex items-center justify-center h-64">
    <div class="text-center">
      <div class="text-6xl mb-4">📭</div>
      <p class="text-gray-500">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Aucune donnée disponible'
  }
})
</script>
