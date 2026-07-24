<template>
  <header class="lg:hidden bg-brand-500 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30">
    <button @click="$emit('openMenu')" class="p-2 -ml-2 rounded-xl hover:bg-white/10 transition">
      <Menu class="w-6 h-6" />
    </button>
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
        <FileText class="w-4 h-4 text-white" />
      </div>
      <h1 class="text-base font-bold">GestBulletin</h1>
    </div>
    <div class="w-10"></div>
  </header>
</template>

<script setup>
import { Menu, FileText } from 'lucide-vue-next'

defineEmits(['openMenu'])
</script>
