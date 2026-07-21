<template>
  <div v-if="visible" class="fixed top-4 right-4 z-50">
    <div :class="[
      'px-6 py-4 rounded-lg shadow-lg',
      type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'
    ]">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  message: String,
  type: {
    type: String,
    default: 'success'
  }
})
</script>
