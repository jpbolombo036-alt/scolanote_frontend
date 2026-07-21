<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Périodes</h1>
      <button @click="openCreateForm" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
        Nouvelle période
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trimestre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verrouillée</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="period in periods" :key="period.id">
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ period.nom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ period.trimesterNom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ period.type }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="period.verrouille ? 'text-red-600' : 'text-green-600'">
                {{ period.verrouille ? 'Oui' : 'Non' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="openEditForm(period)" class="text-primary-600 hover:text-primary-800 mr-2">Modifier</button>
              <button @click="deletePeriod(period.id)" class="text-red-600 hover:text-red-800">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PeriodForm v-if="showForm" :period="editingPeriod" @save="savePeriod" @close="showForm = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const periods = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingPeriod = ref(null)

onMounted(() => {
  loadPeriods()
})

async function loadPeriods() {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('/api/periodes')
    periods.value = response.data
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  editingPeriod.value = null
  showForm.value = true
}

function openEditForm(period) {
  editingPeriod.value = period
  showForm.value = true
}

async function savePeriod(data) {
  try {
    if (editingPeriod.value) {
      await axios.put(`/api/periodes/${editingPeriod.value.id}`, data)
    } else {
      await axios.post('/api/periodes', data)
    }
    showForm.value = false
    await loadPeriods()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}

async function deletePeriod(id) {
  if (!confirm('Êtes-vous sûr ?')) return
  try {
    await axios.delete(`/api/periodes/${id}`)
    await loadPeriods()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  }
}
</script>
