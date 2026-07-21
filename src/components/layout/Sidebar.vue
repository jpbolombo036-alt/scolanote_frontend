<template>
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
</template>

<script setup>
</script>
