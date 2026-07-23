<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Détail du bulletin</h1>
      <button @click="downloadPdf" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
        Télécharger PDF
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="reportCard" class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="font-semibold">Élève:</span> {{ reportCard.studentNom }}
          </div>
          <div>
            <span class="font-semibold">Matricule:</span> {{ reportCard.studentMatricule }}
          </div>
          <div>
            <span class="font-semibold">Classe:</span> {{ reportCard.classroomNom }}
          </div>
          <div>
            <span class="font-semibold">Période:</span> {{ reportCard.periodNom }}
          </div>
          <div>
            <span class="font-semibold">Mention:</span> {{ reportCard.mention }}
          </div>
          <div>
            <span class="font-semibold">Décision:</span> {{ reportCard.decision }}
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Détails par matière</h3>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Matière</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Coeff</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Moyenne</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rang</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">%</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Appréciation</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="detail in reportCard.details" :key="detail.id">
              <td class="px-4 py-3">{{ detail.subjectNom }}</td>
              <td class="px-4 py-3">{{ detail.coefficient }}</td>
              <td class="px-4 py-3">{{ detail.moyenne }}</td>
              <td class="px-4 py-3">{{ detail.rangMatiere }}</td>
              <td class="px-4 py-3">{{ detail.points }} / {{ detail.maximum }}</td>
              <td class="px-4 py-3">{{ detail.pourcentage }}%</td>
              <td class="px-4 py-3">{{ detail.observation }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Résumé</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="font-semibold">Total points:</span> {{ reportCard.totalPoints }} / {{ reportCard.maximumPoints }}
          </div>
          <div>
            <span class="font-semibold">Pourcentage:</span> {{ reportCard.pourcentage }}%
          </div>
          <div>
            <span class="font-semibold">Rang:</span> {{ reportCard.rang }}
          </div>
          <div>
            <span class="font-semibold">Absences:</span> {{ reportCard.totalAbsences }}
          </div>
          <div>
            <span class="font-semibold">Retards:</span> {{ reportCard.totalRetards }}
          </div>
          <div>
            <span class="font-semibold">Conduite:</span> {{ reportCard.conduite }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api, { API_BASE_URL } from '@/api/axios'

const route = useRoute()
const reportCard = ref(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const response = await api.get(`/api/bulletins/${route.params.id}`)
    reportCard.value = response.data
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur')
  } finally {
    loading.value = false
  }
})

function downloadPdf() {
  window.open(`${API_BASE_URL}/api/bulletins/${route.params.id}/pdf`, '_blank')
}
</script>
