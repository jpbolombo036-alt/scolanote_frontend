<template>
  <div class="lg:hidden fixed inset-0 z-50" v-if="show">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="absolute left-0 top-0 h-full w-72 bg-white dark:bg-slate-950 shadow-2xl transform transition-transform duration-300 border-r border-slate-200 dark:border-slate-800">
      <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center">
            <FileText class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-base font-bold text-slate-900 dark:text-white">GestBulletin</h1>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">Gestion de bulletins</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <X class="w-5 h-5 text-slate-500 dark:text-slate-300" />
        </button>
      </div>

      <nav class="px-3 pt-3 pb-2 space-y-1 overflow-y-auto max-h-[calc(100vh-16rem)]">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          @click="$emit('close')"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          :class="isActive(item.path)
            ? 'bg-brand-500/10 text-brand-600 dark:bg-slate-800 dark:text-brand-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span>{{ item.name }}</span>
        </router-link>
      </nav>

    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRoute } from 'vue-router'
import { navItems, isNavActive } from '@/config/navigation'

defineProps({
  show: Boolean
})

defineEmits(['close'])

const route = useRoute()

function isActive(path) {
  return isNavActive(path, route.path)
}
</script>
