<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Bulletins</h1>
    </div>

    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Générer des bulletins</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Classe</label>
          <select v-model="classroomId" class="w-full border rounded-lg px-3 py-2">
            <option value="">Sélectionner</option>
            <option v-for="c in classrooms" :key="c.id" :value="c.id">{{ c.nom }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Période</label>
          <select v-model="periodId" class="w-full border rounded-lg px-3 py-2">
            <option value="">Sélectionner</option>
            <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.nom }}</option>
          </select>
        </div>
      </div>
      <button @click="generateBulletins" :disabled="generating" class="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
        {{ generating ? 'Génération...' : 'Générer les bulletins' }}
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moyenne</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mention</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rang</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="reportCard in reportCards" :key="reportCard.id">
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ reportCard.studentNom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ reportCard.classroomNom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ reportCard.periodNom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ reportCard.pourcentage }}%</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ reportCard.mention }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ reportCard.rang }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="viewPdf(reportCard.id)" class="text-primary-600 hover:text-primary-800">PDF</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const reportCards = ref([])
const classrooms = ref([])
const periods = ref([])
const classroomId = ref('')
const periodId = ref('')
const loading = ref(false)
const error = ref(null)
const generating = ref(false)

onMounted(async () => {
  await Promise.all([loadClassrooms(), loadPeriods(), loadReportCards()])
})

async function loadClassrooms() {
  try {
    const response = await axios.get('/api/salles')
    classrooms.value = response.data
  } catch (e) {
    console.error('Erreur lors du chargement des classes', e)
  }
}

async function loadPeriods() {
  try {
    const response = await axios.get('/api/periodes')
    periods.value = response.data
  } catch (e) {
    console.error('Erreur lors du chargement des périodes', e)
  }
}

async function loadReportCards() {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('/api/bulletins')
    reportCards.value = response.data
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

async function generateBulletins() {
  if (!classroomId.value || !periodId.value) {
    alert('Veuillez sélectionner une classe et une période')
    return
  }
  generating.value = true
  error.value = null
  try {
    await axios.post('/api/bulletins/generer', {
      classroomId: classroomId.value,
      periodId: periodId.value
    })
    await loadReportCards()
    alert('Bulletins générés avec succès')
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de la génération'
  } finally {
    generating.value = false
  }
}

function viewPdf(id) {
  window.open(`/api/bulletins/${id}/pdf`, '_blank')
}
</script>
