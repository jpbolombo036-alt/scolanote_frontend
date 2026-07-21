<template>
  <header class="bg-white shadow h-16 flex items-center justify-between px-6">
    <h2 class="text-lg font-semibold">{{ title }}</h2>
    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-600">{{ username }}</span>
      <button @click="logout" class="text-sm text-red-600 hover:text-red-800">Déconnexion</button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const title = computed(() => {
  const titles = {
    '/dashboard': 'Tableau de bord',
    '/ecoles': 'Écoles',
    '/annees-academiques': 'Années scolaires',
    '/trimestres': 'Trimestres',
    '/periodes': 'Périodes',
    '/salles': 'Classes',
    '/matieres': 'Matières',
    '/enseignants': 'Professeurs',
    '/eleves': 'Élèves',
    '/inscriptions': 'Inscriptions',
    '/evaluations': 'Évaluations',
    '/notes': 'Notes',
    '/presences': 'Présences',
    '/disciplines': 'Disciplines',
    '/bulletins': 'Bulletins',
    '/users': 'Utilisateurs',
    '/roles': 'Rôles'
  }
  return titles[route.path] || 'ScolaNote'
})

const username = computed(() => authStore.user?.username || 'Utilisateur')

function logout() {
  authStore.logout()
  window.location.href = '/login'
}
</script>
