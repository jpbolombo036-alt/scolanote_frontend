<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Types d'évaluation</h1>
      <button @click="openCreateForm" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
        Nouveau type
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coefficient</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="type in assessmentTypes" :key="type.id">
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ type.nom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ type.coefficient }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="openEditForm(type)" class="text-primary-600 hover:text-primary-800 mr-2">Modifier</button>
              <button @click="deleteAssessmentType(type.id)" class="text-red-600 hover:text-red-800">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AssessmentTypeForm v-if="showForm" :assessment-type="editingType" @save="saveAssessmentType" @close="showForm = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const assessmentTypes = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingType = ref(null)

onMounted(() => {
  loadAssessmentTypes()
})

async function loadAssessmentTypes() {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('/api/types-evaluations')
    assessmentTypes.value = response.data
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  editingType.value = null
  showForm.value = true
}

function openEditForm(type) {
  editingType.value = type
  showForm.value = true
}

async function saveAssessmentType(data) {
  try {
    if (editingType.value) {
      await axios.put(`/api/types-evaluations/${editingType.value.id}`, data)
    } else {
      await axios.post('/api/types-evaluations', data)
    }
    showForm.value = false
    await loadAssessmentTypes()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}

async function deleteAssessmentType(id) {
  if (!confirm('Êtes-vous sûr ?')) return
  try {
    await axios.delete(`/api/types-evaluations/${id}`)
    await loadAssessmentTypes()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}
</script>
