<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Élèves</h1>
      <button @click="openCreateForm" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
        Nouvel élève
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matricule</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Postnom</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sexe</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="student in students" :key="student.id">
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ student.matricule }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ student.nom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ student.postnom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ student.sexe }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="openEditForm(student)" class="text-primary-600 hover:text-primary-800 mr-2">Modifier</button>
              <button @click="deleteStudent(student.id)" class="text-red-600 hover:text-red-800">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <StudentForm v-if="showForm" :student="editingStudent" @save="saveStudent" @close="showForm = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const students = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingStudent = ref(null)

onMounted(() => {
  loadStudents()
})

async function loadStudents() {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('/api/eleves')
    students.value = response.data
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  editingStudent.value = null
  showForm.value = true
}

function openEditForm(student) {
  editingStudent.value = student
  showForm.value = true
}

async function saveStudent(data) {
  try {
    if (editingStudent.value) {
      await axios.put(`/api/eleves/${editingStudent.value.id}`, data)
    } else {
      await axios.post('/api/eleves', data)
    }
    showForm.value = false
    await loadStudents()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}

async function deleteStudent(id) {
  if (!confirm('Êtes-vous sûr ?')) return
  try {
    await axios.delete(`/api/eleves/${id}`)
    await loadStudents()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}
</script>
