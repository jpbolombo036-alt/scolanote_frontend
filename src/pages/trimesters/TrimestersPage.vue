<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Trimestres</h1>
      <button @click="openCreateForm" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
        Nouveau trimestre
      </button>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{{ error }}</div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Année</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordre</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="trimester in trimesters" :key="trimester.id">
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ trimester.nom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ trimester.academicYearLibelle }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ trimester.ordre }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="openEditForm(trimester)" class="text-primary-600 hover:text-primary-800 mr-2">Modifier</button>
              <button @click="deleteTrimester(trimester.id)" class="text-red-600 hover:text-red-800">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <TrimesterForm v-if="showForm" :trimester="editingTrimester" @save="saveTrimester" @close="showForm = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const trimesters = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingTrimester = ref(null)

onMounted(() => {
  loadTrimesters()
})

async function loadTrimesters() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/trimestres')
    trimesters.value = response.data
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  editingTrimester.value = null
  showForm.value = true
}

function openEditForm(trimester) {
  editingTrimester.value = trimester
  showForm.value = true
}

async function saveTrimester(data) {
  try {
    if (editingTrimester.value) {
      await api.put(`/api/trimestres/${editingTrimester.value.id}`, data)
    } else {
      await api.post('/api/trimestres', data)
    }
    showForm.value = false
    await loadTrimesters()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}

async function deleteTrimester(id) {
  if (!confirm('Êtes-vous sûr ?')) return
  try {
    await api.delete(`/api/trimestres/${id}`)
    await loadTrimesters()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}
</script>
