<template>
  <header class="lg:hidden bg-brand-500 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 dark:bg-slate-950 dark:text-slate-100">
    <button @click="$emit('openMenu')" class="p-2 -ml-2 rounded-xl hover:bg-white/10 dark:hover:bg-slate-800 transition">
      <Menu class="w-6 h-6" />
    </button>
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
        <FileText class="w-4 h-4 text-white" />
      </div>
      <h1 class="text-base font-bold">GestBulletin</h1>
    </div>
    <div class="flex items-center gap-2 relative">
      <button @click="$emit('openMenu')" class="sr-only">menu</button>
      <button
        @click="toggleTheme()"
        :title="isDark ? 'Mode clair' : 'Mode sombre'"
        class="p-2 rounded-xl text-white/90 hover:bg-white/10 transition"
      >
        <Moon v-if="!isDark" class="w-5 h-5" />
        <Sun v-else class="w-5 h-5" />
      </button>

      <button
        @click="toggleProfileMenu"
        :title="'Profil'"
        class="p-2 rounded-xl text-white/90 hover:bg-white/10 transition"
      >
        <User class="w-5 h-5" />
      </button>

      <transition name="fade-slide">
        <div
          v-if="isProfileOpen"
          class="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/10 bg-white text-ink shadow-lg z-40 overflow-hidden"
        >
          <button @click="goToProfile" class="w-full text-left px-4 py-3 hover:bg-surface/50">Mon profil</button>
          <button @click="emitLogout" class="w-full text-left px-4 py-3 text-red-600 hover:bg-surface/50">Se déconnecter</button>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { Menu, FileText, Moon, Sun, User } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { isDark, toggleTheme } = useTheme()

const isProfileOpen = ref(false)
const router = useRouter()

const emit = defineEmits(['openMenu', 'logout'])

function toggleProfileMenu() {
  isProfileOpen.value = !isProfileOpen.value
}

function goToProfile() {
  isProfileOpen.value = false
  router.push('/profil')
}

function emitLogout() {
  isProfileOpen.value = false
  emit('logout')
}
</script>
