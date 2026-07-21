<template>
  <div class="min-h-screen flex">
    <aside class="w-64 bg-gray-900 text-white flex-shrink-0">
      <div class="p-4">
        <h1 class="text-2xl font-bold text-primary-400">ScolaNote</h1>
      </div>
      <nav class="mt-4">
        <router-link to="/dashboard" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>📊</span>
          <span class="ml-3">Dashboard</span>
        </router-link>
        <router-link to="/ecoles" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>🏫</span>
          <span class="ml-3">Écoles</span>
        </router-link>
        <router-link to="/annees-academiques" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>📅</span>
          <span class="ml-3">Années scolaires</span>
        </router-link>
        <router-link to="/trimestres" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>📘</span>
          <span class="ml-3">Trimestres</span>
        </router-link>
        <router-link to="/periodes" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>📅</span>
          <span class="ml-3">Périodes</span>
        </router-link>
        <router-link to="/salles" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>🏢</span>
          <span class="ml-3">Classes</span>
        </router-link>
        <router-link to="/matieres" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>📚</span>
          <span class="ml-3">Matières</span>
        </router-link>
        <router-link to="/enseignants" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>👨‍🏫</span>
          <span class="ml-3">Professeurs</span>
        </router-link>
        <router-link to="/eleves" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>👨‍🎓</span>
          <span class="ml-3">Élèves</span>
        </router-link>
        <router-link to="/inscriptions" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>📝</span>
          <span class="ml-3">Inscriptions</span>
        </router-link>
        <router-link to="/evaluations" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>📋</span>
          <span class="ml-3">Évaluations</span>
        </router-link>
        <router-link to="/notes" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>⭐</span>
          <span class="ml-3">Notes</span>
        </router-link>
        <router-link to="/presences" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>📅</span>
          <span class="ml-3">Présences</span>
        </router-link>
        <router-link to="/disciplines" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>⚖️</span>
          <span class="ml-3">Disciplines</span>
        </router-link>
        <router-link to="/bulletins" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>📄</span>
          <span class="ml-3">Bulletins</span>
        </router-link>
        <router-link to="/users" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>👥</span>
          <span class="ml-3">Utilisateurs</span>
        </router-link>
        <router-link to="/roles" class="flex items-center px-4 py-3 hover:bg-gray-800">
          <span>🔑</span>
          <span class="ml-3">Rôles</span>
        </router-link>
      </nav>
    </aside>
    <div class="flex-1 flex flex-col">
      <header class="bg-white shadow h-16 flex items-center justify-between px-6">
        <h2 class="text-lg font-semibold">{{ currentPageTitle }}</h2>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">{{ authStore.user?.username }}</span>
          <button @click="logout" class="text-sm text-red-600 hover:text-red-800">Déconnexion</button>
        </div>
      </header>
      <main class="flex-1 p-6 bg-gray-50">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const currentPageTitle = computed(() => {
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

function logout() {
  authStore.logout()
  window.location.href = '/login'
}
</script>
