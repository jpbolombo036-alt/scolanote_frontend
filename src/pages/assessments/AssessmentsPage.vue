<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Évaluations</h1>
      <button @click="openCreateForm" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
        Nouvelle évaluation
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note max</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="assessment in assessments" :key="assessment.id">
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ assessment.titre }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ assessment.assessmentTypeNom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ assessment.periodNom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ assessment.noteMax }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="openEditForm(assessment)" class="text-primary-600 hover:text-primary-800 mr-2">Modifier</button>
              <button @click="deleteAssessment(assessment.id)" class="text-red-600 hover:text-red-800">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AssessmentForm v-if="showForm" :assessment="editingAssessment" @save="saveAssessment" @close="showForm = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const assessments = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingAssessment = ref(null)

onMounted(() => {
  loadAssessments()
})

async function loadAssessments() {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('/api/evaluations')
    assessments.value = response.data
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  editingAssessment.value = null
  showForm.value = true
}

function openEditForm(assessment) {
  editingAssessment.value = assessment
  showForm.value = true
}

async function saveAssessment(data) {
  try {
    if (editingAssessment.value) {
      await axios.put(`/api/evaluations/${editingAssessment.value.id}`, data)
    } else {
      await axios.post('/api/evaluations', data)
    }
    showForm.value = false
    await loadAssessments()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}

async function deleteAssessment(id) {
  if (!confirm('Êtes-vous sûr ?')) return
  try {
    await axios.delete(`/api/evaluations/${id}`)
    await loadAssessments()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}
</script>
