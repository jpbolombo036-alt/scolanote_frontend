<template>
  <div class="h-screen overflow-hidden bg-surface font-sans text-ink selection:bg-brand-500 selection:text-white">
    <!-- Mobile Header -->
    <MobileHeader @open-menu="mobileMenuOpen = true" />

    <!-- Desktop Sidebar -->
    <aside
      :class="[
        'fixed left-0 top-0 h-screen overflow-y-auto flex flex-col justify-between shrink-0 transition-all duration-300 z-40 scrollbar-hide bg-brand-600 text-white',
        isCollapsed ? 'w-20' : 'w-64',
        'hidden lg:flex'
      ]"
    >
      <div>
        <div class="h-20 px-4 flex items-center gap-3 border-b border-white/10">
          <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
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
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
            ]"
            :title="isCollapsed ? item.name : undefined"
          >
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
            <span v-if="!isCollapsed" class="ml-3 truncate">{{ item.name }}</span>
          </router-link>
        </nav>
      </div>

      <div class="p-3 border-t border-white/10">
        <button
          @click="logout"
          :class="[
            'w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-white/25 text-white hover:bg-white/10 transition',
            isCollapsed ? 'px-2' : ''
          ]"
        >
          <LogOut class="w-4 h-4 shrink-0" />
          <span v-if="!isCollapsed">Déconnexion</span>
        </button>
      </div>

      <button
        @click="isCollapsed = !isCollapsed"
        class="absolute top-24 -right-3 w-6 h-6 rounded-full bg-white text-brand-600 shadow-md border border-slate-100 flex items-center justify-center z-50 hover:scale-105 transition"
        :title="isCollapsed ? 'Agrandir' : 'Réduire'"
      >
        <ChevronLeft v-if="!isCollapsed" class="w-3.5 h-3.5" />
        <ChevronRight v-else class="w-3.5 h-3.5" />
      </button>
    </aside>

    <!-- Mobile Menu Drawer -->
    <MobileMenuDrawer :show="mobileMenuOpen" @close="mobileMenuOpen = false" />

    <!-- MAIN CONTENT -->
    <div class="h-screen flex flex-col min-w-0 transition-all duration-300 lg:ml-64">
      <header
        class="hidden lg:flex fixed top-0 right-0 h-20 bg-white/90 backdrop-blur border-b border-slate-100 px-4 sm:px-6 items-center justify-between z-30 transition-all duration-300 left-64"
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

          <div class="flex items-center gap-2.5 pl-1">
            <div class="w-9 h-9 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">
              {{ userInitials }}
            </div>
            <div class="hidden sm:block leading-tight">
              <p class="text-sm font-semibold text-ink">{{ displayName }}</p>
              <p class="text-xs text-ink-muted">{{ displayRole }}</p>
            </div>
            <ChevronDown class="w-4 h-4 text-ink-muted hidden sm:block" />
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto pt-14 lg:pt-20 bg-surface pb-14 lg:pb-0">
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboard,
  School,
  Calendar,
  Clock,
  Layers,
  BookOpen,
  UserCheck,
  Users,
  FileSpreadsheet,
  CheckSquare,
  Star,
  CheckCircle2,
  ShieldAlert,
  FileText,
  UserCog,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Bell,
  Search
} from 'lucide-vue-next'

import MobileHeader from '@/components/mobile/MobileHeader.vue'
import MobileMenuDrawer from '@/components/mobile/MobileMenuDrawer.vue'
import BottomNav from '@/components/mobile/BottomNav.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)
const mobileMenuOpen = ref(false)

const navItems = [
  { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Élèves', path: '/eleves', icon: Users },
  { name: 'Classes', path: '/salles', icon: Layers },
  { name: 'Matières', path: '/matieres', icon: BookOpen },
  { name: 'Bulletins', path: '/bulletins', icon: FileText },
  { name: 'Notes', path: '/notes', icon: Star },
  { name: 'Évaluations', path: '/evaluations', icon: CheckSquare },
  { name: 'Enseignants', path: '/enseignants', icon: UserCheck },
  { name: 'Inscriptions', path: '/inscriptions', icon: FileSpreadsheet },
  { name: 'Présences', path: '/presences', icon: CheckCircle2 },
  { name: 'Disciplines', path: '/disciplines', icon: ShieldAlert },
  { name: 'Écoles', path: '/ecoles', icon: School },
  { name: 'Années scolaires', path: '/annees-academiques', icon: Calendar },
  { name: 'Trimestres', path: '/trimestres', icon: Clock },
  { name: 'Périodes', path: '/periodes', icon: Layers },
  { name: 'Utilisateurs', path: '/users', icon: UserCog },
  { name: 'Rôles', path: '/roles', icon: KeyRound }
]

function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/')
}

const currentPageTitle = computed(() => {
  const current = navItems.find(item => isActive(item.path))
  return current ? current.name : 'GestBulletin'
})

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
</script>
