<template>
  <aside class="w-64 bg-gray-900 text-white flex-shrink-0">
    <div class="p-4">
      <h1 class="text-2xl font-bold text-primary-400">ScolaNote</h1>
    </div>
    <nav class="mt-4">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center px-4 py-3 rounded-r-full transition-colors duration-150"
        :class="isActive(item.path) ? 'bg-gray-800 text-white' : 'text-slate-300 hover:bg-gray-800 hover:text-white'"
      >
        <component :is="item.icon" class="w-4 h-4" />
        <span class="ml-3">{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { navItems, isNavActive } from '@/config/navigation'

const route = useRoute()

function isActive(path: string) {
  return isNavActive(path, route.path)
}
</script>
