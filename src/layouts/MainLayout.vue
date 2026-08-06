<template>
  <div class="min-h-screen bg-surface font-sans text-ink selection:bg-brand-500 selection:text-white">
    <!-- Mobile Header -->
    <MobileHeader @open-menu="mobileMenuOpen = true" @logout="logout" />

    <!-- Desktop Sidebar -->
    <aside
      :class="[
        'fixed left-0 top-0 h-screen overflow-y-auto flex flex-col justify-between shrink-0 transition-all duration-300 z-40 scrollbar-hide bg-brand-600 text-white dark:bg-slate-950 dark:text-slate-100',
        isCollapsed ? 'w-20' : 'w-64',
        'hidden lg:flex'
      ]"
    >
      <div>
        <div class="h-20 px-4 flex items-center gap-3 border-b border-white/10 dark:border-slate-700">
          <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 dark:bg-white/10">
            <FileText class="w-5 h-5 text-white" />
          </div>
          <div v-if="!isCollapsed" class="min-w-0">
            <h1 class="text-base font-bold leading-tight truncate">GestBulletin</h1>
            <p class="text-[10px] text-blue-100/80 truncate">Gestion de bulletins</p>
          </div>
        </div>

        <nav class="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-11rem)] scrollbar-hide">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
              isActive(item.path)
                ? 'bg-white/20 text-white shadow-sm dark:bg-slate-700/70 dark:text-slate-100'
                : 'text-blue-100/80 hover:bg-white/10 hover:text-white dark:text-slate-300 dark:hover:bg-slate-700/70'
            ]"
            :title="isCollapsed ? item.name : undefined"
          >
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
            <span v-if="!isCollapsed" class="ml-3 truncate">{{ item.name }}</span>
          </router-link>
        </nav>
      </div>

      <div class="p-3 border-t border-white/10 dark:border-slate-700">
        <button
          @click="isCollapsed = !isCollapsed"
          class="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-white/25 text-white hover:bg-white/10 transition dark:border-slate-700 dark:hover:bg-slate-800/70"
          :title="isCollapsed ? 'Agrandir' : 'Réduire'"
        >
          <span v-if="isCollapsed">&#x2192;</span>
          <ChevronLeft v-if="!isCollapsed" class="w-4 h-4" />
          <ChevronRight v-else class="w-4 h-4" />
        </button>
      </div>

    </aside>

    <!-- Mobile Menu Drawer -->
    <MobileMenuDrawer :show="mobileMenuOpen" @close="mobileMenuOpen = false" />

    <!-- MAIN CONTENT -->
    <div class="min-h-screen flex flex-col min-w-0 transition-all duration-300" :class="isCollapsed ? 'lg:ml-20' : 'lg:ml-64'">
      <header
        class="hidden lg:flex fixed top-0 right-0 h-20 bg-white/90 backdrop-blur border-b border-slate-100 px-4 sm:px-6 items-center justify-between z-30 transition-all duration-300"
        :class="isCollapsed ? 'left-20' : 'left-64'"
      >
        <h2 class="text-xl font-bold text-ink tracking-tight truncate">{{ currentPageTitle }}</h2>

        <div class="flex-1 max-w-md mx-4 hidden md:block">
          <div class="relative">
            <Search class="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Rechercher..."
              class="w-full h-10 pl-10 pr-4 rounded-xl bg-surface border-0 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button class="relative p-2.5 rounded-xl text-ink-soft hover:bg-surface transition">
            <Bell class="w-5 h-5" />
            <span class="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">3</span>
          </button>

          <div class="flex items-center gap-2.5 pl-1 relative">
            <div ref="userMenuTrigger">
              <button
                @click.stop="toggleUserMenu"
                class="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:bg-slate-50 transition"
              >
                <div class="w-9 h-9 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">
                  {{ userInitials }}
                </div>
                <div class="hidden sm:block leading-tight text-left">
                  <p class="text-sm font-semibold text-ink">{{ displayName }}</p>
                  <p class="text-xs text-ink-muted">{{ displayRole }}</p>
                </div>
                <ChevronDown class="w-4 h-4 text-ink-muted hidden sm:block" />
              </button>

              <transition name="fade-slide">
                <div
                  v-if="isUserMenuOpen"
                  ref="userMenuPanel"
                  class="absolute right-0 z-50 mt-3 w-[300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5"
                  @click.stop
                >
                  <div class="px-4 py-3 border-b border-slate-100">
                    <p class="text-sm font-semibold text-ink truncate">{{ displayName }}</p>
                    <p class="text-xs text-ink-muted truncate">{{ displayRole }}</p>
                  </div>
                  <div class="py-2">
                    <button
                      type="button"
                      @click="goToProfile"
                      class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-ink hover:bg-slate-50 transition"
                    >
                      <User class="w-4 h-4 text-ink-muted" />
                      <span>Mon profil</span>
                    </button>
                    <button
                      type="button"
                      @click="toggleThemeMenu"
                      class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-ink hover:bg-slate-50 transition"
                    >
                      <Moon class="w-4 h-4 text-ink-muted" />
                      <span>{{ isDark ? 'Mode clair' : 'Mode sombre' }}</span>
                    </button>
                    <button
                      type="button"
                      @click="logout"
                      class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-slate-50 transition"
                    >
                      <LogOut class="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto pt-14 lg:pt-20 bg-surface pb-14 lg:pb-0">
        <div v-if="authStore.passwordResetRequired" class="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 lg:px-8 py-3">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
              <ShieldAlert class="w-5 h-5 text-amber-600" />
              <p class="text-sm font-medium text-amber-800">
                Vous utilisez un mot de passe temporaire. Veuillez le changer dans <router-link to="/profil" class="underline font-semibold">votre profil</router-link>.
              </p>
            </div>
          </div>
        </div>
        <div class="p-4 sm:p-6 lg:p-8">
          <router-view />
        </div>
      </main>
    </div>

    <!-- Bottom Navigation (mobile only) -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
  Search,
  FileText,
  Moon,
  Sun,
  User,
  LogOut,
  ShieldAlert
} from 'lucide-vue-next'

import MobileHeader from '@/components/mobile/MobileHeader.vue'
import MobileMenuDrawer from '@/components/mobile/MobileMenuDrawer.vue'
import BottomNav from '@/components/mobile/BottomNav.vue'
import { navItems, isNavActive, getPageTitle } from '@/config/navigation'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)
const mobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const userMenuTrigger = ref(null)
const userMenuPanel = ref(null)

function isActive(path) {
  return isNavActive(path, route.path)
}

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

function closeUserMenu() {
  isUserMenuOpen.value = false
}

function goToProfile() {
  closeUserMenu()
  router.push('/profil')
}

function toggleThemeMenu() {
  toggleTheme()
  closeUserMenu()
}

function onDocumentPointer(event) {
  const target = event.target
  if (!isUserMenuOpen.value || !(target instanceof Node)) {
    return
  }

  if (
    !userMenuTrigger.value?.contains(target) &&
    !userMenuPanel.value?.contains(target)
  ) {
    closeUserMenu()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentPointer)
  document.addEventListener('touchstart', onDocumentPointer)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentPointer)
  document.removeEventListener('touchstart', onDocumentPointer)
})

const currentPageTitle = computed(() => getPageTitle(route.path))

const userInitials = computed(() => {
  const username = authStore.user?.username || 'JS'
  return username.substring(0, 2).toUpperCase()
})

const displayName = computed(() => authStore.user?.username || 'Jean Sala')
const displayRole = computed(() => {
  const roles = authStore.roles
  if (Array.isArray(roles) && roles.length) {
    const role = roles[0]
    const labels = {
      SUPER_ADMIN: 'Super Admin',
      ADMIN: 'Administrateur',
      DIRECTEUR: 'Directeur',
      PREFET: 'Préfet',
      ENSEIGNANT: 'Enseignant'
    }
    return labels[role] || role
  }
  return 'Administrateur'
})

function logout() {
  authStore.logout()
  router.push('/login')
}

// Theme
import { useTheme } from '@/composables/useTheme'
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

