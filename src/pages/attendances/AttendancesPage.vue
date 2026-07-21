<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Présences</h1>
      <button @click="openCreateForm" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
        Nouvelle présence
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Retard</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absence</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="attendance in attendances" :key="attendance.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ attendance.studentNom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ attendance.date }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ attendance.retard ? 'Oui' : 'Non' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ attendance.absence ? 'Oui' : 'Non' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="openEditForm(attendance)" class="text-primary-600 hover:text-primary-800 mr-2">Modifier</button>
              <button @click="deleteAttendance(attendance.id)" class="text-red-600 hover:text-red-800">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AttendanceForm v-if="showForm" :attendance="editingAttendance" @save="saveAttendance" @close="showForm = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const attendances = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingAttendance = ref(null)

onMounted(() => {
  loadAttendances()
})

async function loadAttendances() {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('/api/presences')
    attendances.value = response.data
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  editingAttendance.value = null
  showForm.value = true
}

function openEditForm(attendance) {
  editingAttendance.value = attendance
  showForm.value = true
}

async function saveAttendance(data) {
  try {
    if (editingAttendance.value) {
      await axios.put(`/api/presences/${editingAttendance.value.id}`, data)
    } else {
      await axios.post('/api/presences', data)
    }
    showForm.value = false
    await loadAttendances()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}

async function deleteAttendance(id) {
  if (!confirm('Êtes-vous sûr ?')) return
  try {
    await axios.delete(`/api/presences/${id}`)
    await loadAttendances()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}
</script>
