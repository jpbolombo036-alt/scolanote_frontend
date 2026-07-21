<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Rôles</h1>
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="role in roles" :key="role.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ role.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ role.nom }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const roles = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/roles')
    roles.value = response.data
  } catch (e) {
    console.error('Erreur', e)
  } finally {
    loading.value = false
  }
})
</script>
