<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Années scolaires</h1>
      <button @click="openCreateForm" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
        Nouvelle année
      </button>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Libellé</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">École</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date début</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date fin</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="year in academicYears" :key="year.id">
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ year.libelle }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ year.schoolId }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ year.dateDebut }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ year.dateFin }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="openEditForm(year)" class="text-primary-600 hover:text-primary-800 mr-2">Modifier</button>
              <button @click="deleteAcademicYear(year.id)" class="text-red-600 hover:text-red-800">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AcademicYearForm v-if="showForm" :academic-year="editingYear" @save="saveAcademicYear" @close="showForm = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const academicYears = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingYear = ref(null)

onMounted(() => {
  loadAcademicYears()
})

async function loadAcademicYears() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/annees-academiques')
    academicYears.value = response.data
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  editingYear.value = null
  showForm.value = true
}

function openEditForm(year) {
  editingYear.value = year
  showForm.value = true
}

async function saveAcademicYear(data) {
  try {
    if (editingYear.value) {
      await api.put(`/api/annees-academiques/${editingYear.value.id}`, data)
    } else {
      await api.post('/api/annees-academiques', data)
    }
    showForm.value = false
    await loadAcademicYears()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur lors de la sauvegarde')
  }
}

async function deleteAcademicYear(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette année scolaire ?')) return
  try {
    await api.delete(`/api/annees-academiques/${id}`)
    await loadAcademicYears()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur lors de la suppression')
  }
}
</script>
