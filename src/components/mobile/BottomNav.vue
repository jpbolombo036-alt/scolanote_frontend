<template>
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0d1527] border-t border-slate-200 dark:border-slate-800 z-40 safe-area-pb">
    <div class="flex items-center justify-around h-14">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center gap-0.5 py-1 px-2 min-w-[56px] transition-all duration-200"
        :class="isActive(item.path)
          ? 'text-brand-500'
          : 'text-slate-400 dark:text-slate-500'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Users,
  Star,
  FileText,
  Menu
} from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { name: 'Accueil', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Élèves', path: '/eleves', icon: Users },
  { name: 'Notes', path: '/notes', icon: Star },
  { name: 'Bulletins', path: '/bulletins', icon: FileText },
  { name: 'Menu', path: '#', icon: Menu }
]

function isActive(path) {
  if (path === '#') return false
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
