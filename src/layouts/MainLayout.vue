<template>
  <div class="h-screen overflow-hidden bg-[#090f1e] dark:bg-[#090f1e] light:bg-[#f4f7fb] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200">
    
    <!-- SIDEBAR -->
    <aside
      :class="[
        'fixed left-0 top-0 h-screen overflow-y-auto border-r flex flex-col justify-between shrink-0 transition-all duration-300 z-40 scrollbar-hide',
        isCollapsed ? 'w-20' : 'w-64',
        isDark
          ? 'bg-[#0d1527] border-slate-800/80 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      ]"
    >
      <div>
        <!-- Sidebar Brand Header -->
        <div class="h-20 px-4 flex items-center justify-between border-b" :class="isDark ? 'border-slate-800/60' : 'border-slate-200/80'">
          <div class="flex items-center space-x-3 overflow-hidden">
            <div class="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/30">
              S
            </div>
            <div v-if="!isCollapsed" class="whitespace-nowrap">
              <h1 class="text-lg font-bold leading-tight" :class="isDark ? 'text-white' : 'text-slate-900'">ScolaNote</h1>
              <p class="text-[10px] uppercase tracking-wider text-emerald-500 font-semibold">Gestion Scolaire</p>
            </div>
          </div>
          
          <button
            @click="isCollapsed = !isCollapsed"
            class="p-2 rounded-lg transition"
            :class="isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/70' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'"
            :title="isCollapsed ? 'Agrandir le menu' : 'Réduire le menu'"
          >
            <ChevronLeft v-if="!isCollapsed" class="w-5 h-5" />
            <ChevronRight v-else class="w-5 h-5" />
          </button>
        </div>

        <!-- Navigation Menu -->
        <nav class="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-10rem)] scrollbar-hide">
          <template v-for="item in navItems" :key="item.path">
            <router-link
              :to="item.path"
              :class="[
                'flex items-center px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative',
                route.path === item.path
                  ? (isDark ? 'bg-white text-slate-950 font-bold shadow-md shadow-white/10' : 'bg-slate-900 text-white font-bold shadow-md shadow-slate-900/10')
                  : (isDark ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
              ]"
            >
              <component
                :is="item.icon"
                :class="[
                  'w-5 h-5 shrink-0 transition-colors',
                  route.path === item.path ? (isDark ? 'text-slate-950' : 'text-white') : (isDark ? 'text-slate-400 group-hover:text-emerald-400' : 'text-slate-500 group-hover:text-slate-900')
                ]"
              />
              <span v-if="!isCollapsed" class="ml-3 truncate">{{ item.name }}</span>
              
              <!-- Indicator for active item when collapsed -->
              <span
                v-if="isCollapsed && route.path === item.path"
                class="absolute right-1 w-1.5 h-6 bg-emerald-500 rounded-full"
              ></span>
            </router-link>
          </template>
        </nav>
      </div>

      <!-- User Profile at Bottom of Sidebar -->
      <div class="p-3 border-t" :class="isDark ? 'border-slate-800/60 bg-[#0a1120]' : 'border-slate-200/80 bg-slate-50'">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 overflow-hidden">
            <div class="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-sm flex items-center justify-center shrink-0 ring-2 ring-emerald-400/20">
              {{ userInitials }}
            </div>
            <div v-if="!isCollapsed" class="truncate">
              <p class="text-sm font-semibold truncate" :class="isDark ? 'text-white' : 'text-slate-900'">{{ authStore.user?.username || 'Utilisateur' }}</p>
              <p class="text-xs truncate" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Connecté</p>
            </div>
          </div>

          <button
            v-if="!isCollapsed"
            @click="logout"
            class="p-2 rounded-lg transition"
            :class="isDark ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-500 hover:text-red-600 hover:bg-red-50'"
            title="Se déconnecter"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>

    <!-- MAIN CONTENT WRAPPER -->
    <div class="h-screen flex flex-col min-w-0 transition-all duration-300" :class="isCollapsed ? 'ml-20' : 'ml-64'">
      
      <!-- TOP HEADER BAR -->
      <header class="fixed top-0 right-0 h-20 border-b backdrop-blur px-6 flex items-center justify-between z-30 transition-colors duration-200" :class="[
        isDark ? 'bg-[#0d1527]/90 border-slate-800/80' : 'bg-white/90 border-slate-200/80',
        isCollapsed ? 'left-20' : 'left-64'
      ]">
        <div>
          <h2 class="text-xl font-bold tracking-tight" :class="isDark ? 'text-white' : 'text-slate-900'">{{ currentPageTitle }}</h2>
        </div>

        <div class="flex items-center space-x-3">
          
          <!-- Theme Toggle Button (Dark / Light) -->
          <button
            @click="toggleTheme"
            class="p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center border"
            :class="isDark ? 'text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border-slate-700/60' : 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'"
            :title="isDark ? 'Passer au mode clair' : 'Passer au mode sombre'"
          >
            <Sun v-if="isDark" class="w-5 h-5 text-amber-400" />
            <Moon v-else class="w-5 h-5 text-slate-700" />
          </button>

          <!-- Notification Icon -->
          <button class="relative p-2.5 rounded-xl transition border"
            :class="isDark ? 'text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border-slate-700/60' : 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'"
          >
            <Bell class="w-5 h-5" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2" :class="isDark ? 'ring-[#0d1527]' : 'ring-white'"></span>
          </button>

          <!-- User Pill Badge -->
          <div class="flex items-center space-x-3 rounded-full py-1.5 px-3 border" :class="isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-100 border-slate-200'">
            <div class="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center">
              {{ userInitials }}
            </div>
            <span class="text-xs font-semibold hidden sm:inline" :class="isDark ? 'text-slate-200' : 'text-slate-800'">{{ authStore.user?.username || 'Admin' }}</span>
          </div>
        </div>
      </header>

      <!-- PAGE VIEW CONTENT -->
      <main class="flex-1 overflow-y-auto transition-colors duration-200 pt-20" :class="isDark ? 'bg-[#090f1e] text-slate-100' : 'bg-slate-50 text-slate-900'">
        <div class="p-6 lg:p-8">
          <router-view />
        </div>
      </main>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
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
  LogOut,
  Bell,
  Sun,
  Moon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()

const isCollapsed = ref(false)

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Écoles', path: '/ecoles', icon: School },
  { name: 'Années scolaires', path: '/annees-academiques', icon: Calendar },
  { name: 'Trimestres', path: '/trimestres', icon: Clock },
  { name: 'Périodes', path: '/periodes', icon: Layers },
  { name: 'Classes', path: '/salles', icon: Layers },
  { name: 'Matières', path: '/matieres', icon: BookOpen },
  { name: 'Professeurs', path: '/enseignants', icon: UserCheck },
  { name: 'Élèves', path: '/eleves', icon: Users },
  { name: 'Inscriptions', path: '/inscriptions', icon: FileSpreadsheet },
  { name: 'Évaluations', path: '/evaluations', icon: CheckSquare },
  { name: 'Notes', path: '/notes', icon: Star },
  { name: 'Présences', path: '/presences', icon: CheckCircle2 },
  { name: 'Disciplines', path: '/disciplines', icon: ShieldAlert },
  { name: 'Bulletins', path: '/bulletins', icon: FileText },
  { name: 'Utilisateurs', path: '/users', icon: UserCog },
  { name: 'Rôles', path: '/roles', icon: KeyRound }
]

const currentPageTitle = computed(() => {
  const current = navItems.find(item => item.path === route.path)
  return current ? current.name : 'ScolaNote'
})

const userInitials = computed(() => {
  const username = authStore.user?.username || 'SN'
  return username.substring(0, 2).toUpperCase()
})

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
