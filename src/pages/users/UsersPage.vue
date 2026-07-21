<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Utilisateurs</h1>
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôles</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actif</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ user.username }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.roles?.join(', ') }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.enabled ? 'Oui' : 'Non' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/users')
    users.value = response.data.content || response.data
  } catch (e) {
    console.error('Erreur', e)
  } finally {
    loading.value = false
  }
})
</script>
