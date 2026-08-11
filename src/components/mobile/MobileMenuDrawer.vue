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
        <template v-for="group in groupedNav" :key="group.name">
          <div class="mb-2">
            <button
              @click="toggleGroup(group.name)"
              class="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span>{{ group.name }}</span>
              <span class="text-xs text-slate-400">{{ isOpen(group.name) ? '–' : '+' }}</span>
            </button>

            <div v-show="isOpen(group.name)" class="mt-2 space-y-1">
              <router-link
                v-for="item in group.items"
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
            </div>
          </div>
        </template>
      </nav>

      <div class="px-3 py-4 border-t border-slate-100 dark:border-slate-800">
        <router-link
          to="/profil"
          @click="$emit('close')"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <User class="w-5 h-5" />
          <span>Mon profil</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import { LogOut, FileText, X, User } from 'lucide-vue-next'
import { getFilteredNavItems, isNavActive } from '@/config/navigation'


const emit = defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()


function isActive(path) {
  return isNavActive(path, route.path)
}

function logout() {
  authStore.logout()
  router.push('/login')
  emit('close')
}

const props = defineProps({
  show: Boolean
})

// Build grouped nav
import { computed, ref } from 'vue'

const groupedNav = computed(() => {
  const groups = new Map()
  getFilteredNavItems(authStore.roles, authStore.permissions).forEach(item => {
    if (item.skipInGroups) return
    const g = item.group || 'Général'
    if (!groups.has(g)) groups.set(g, [])
    groups.get(g).push(item)
  })
  // Convert to array preserving insertion order and remove duplicate items by path
  return Array.from(groups.entries()).map(([name, items]) => {
    const uniqueByPath = Array.from(new Map(items.map(i => [i.path, i])).values())
    return { name, items: uniqueByPath }
  })
})

const openGroups = ref({})
// default open for first two groups
groupedNav.value.slice(0, 2).forEach(g => {
  openGroups.value[g.name] = true
})

function toggleGroup(name) {
  openGroups.value[name] = !openGroups.value[name]
}

function isOpen(name) {
  return !!openGroups.value[name]
}
</script>

