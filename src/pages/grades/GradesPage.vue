<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Notes</h1>
      <button @click="openCreateForm" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
        Nouvelle note
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Évaluation</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absence</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="grade in grades" :key="grade.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ grade.studentNom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ grade.assessmentId }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ grade.note }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ grade.absence ? 'Oui' : 'Non' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="openEditForm(grade)" class="text-primary-600 hover:text-primary-800 mr-2">Modifier</button>
              <button @click="deleteGrade(grade.id)" class="text-red-600 hover:text-red-800">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <GradeForm v-if="showForm" :grade="editingGrade" @save="saveGrade" @close="showForm = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const grades = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingGrade = ref(null)

onMounted(() => {
  loadGrades()
})

async function loadGrades() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/notes')
    grades.value = response.data
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  editingGrade.value = null
  showForm.value = true
}

function openEditForm(grade) {
  editingGrade.value = grade
  showForm.value = true
}

async function saveGrade(data) {
  try {
    if (editingGrade.value) {
      await api.put(`/api/notes/${editingGrade.value.id}`, data)
    } else {
      await api.post('/api/notes', data)
    }
    showForm.value = false
    await loadGrades()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}

async function deleteGrade(id) {
  if (!confirm('Êtes-vous sûr ?')) return
  try {
    await api.delete(`/api/notes/${id}`)
    await loadGrades()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}
</script>
