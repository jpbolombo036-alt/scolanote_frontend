<template>
  <div class="lg:hidden fixed inset-0 z-50" v-if="show">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="absolute left-0 top-0 h-full w-72 bg-white dark:bg-[#0d1527] shadow-2xl transform transition-transform duration-300">
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
          <X class="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <nav class="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          @click="$emit('close')"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          :class="isActive(item.path)
            ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span>{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-100 dark:border-slate-800">
        <button
          @click="logout"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <LogOut class="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
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
  LogOut,
  X
} from 'lucide-vue-next'

defineProps({
  show: Boolean
})

defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

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

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
