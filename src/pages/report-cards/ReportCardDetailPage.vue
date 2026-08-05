<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Détail du bulletin</h1>
      <div class="flex items-center gap-2">
        <button @click="downloadPdf" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          Télécharger PDF
        </button>
        <button v-if="canValidatePrefet" @click="validatePrefet" :disabled="actions.prefet" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50">
          <Shield class="w-3.5 h-3.5" />
          Valider Préfet
        </button>
        <button v-if="canValidateDirecteur" @click="validateDirecteur" :disabled="actions.directeur" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50">
          <UserCheck class="w-3.5 h-3.5" />
          Valider Directeur
        </button>
        <button v-if="canSign" @click="sign" :disabled="actions.sign" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50">
          <Signature class="w-3.5 h-3.5" />
          Signer
        </button>
        <button v-if="canPublish" @click="publish" :disabled="actions.publish" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50">
          <Send class="w-3.5 h-3.5" />
          Publier
        </button>
      </div>
    </div>

    <div v-if="success" class="border border-brand-500/20 bg-brand-500/10 p-3 text-sm font-medium text-brand-600 mb-4 rounded-xl">
      {{ success }}
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
    <div v-else-if="error" class="border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600">
      {{ error }}
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
              <td class="px-4 py-3">{{ formatMoyenne(detail.moyenne) }}</td>
              <td class="px-4 py-3">{{ detail.rangMatiere }}</td>
              <td class="px-4 py-3">{{ formatMoyenne(detail.points) }} / {{ formatMoyenne(detail.maximum) }}</td>
              <td class="px-4 py-3">{{ formatMoyenne(detail.pourcentage) }}%</td>
              <td class="px-4 py-3">{{ detail.observation }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Résumé</h3>
          <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="font-semibold">Total points:</span> {{ formatMoyenne(reportCard.totalPoints) }} / {{ formatMoyenne(reportCard.maximumPoints) }}
          </div>
          <div>
            <span class="font-semibold">Pourcentage:</span> {{ formatMoyenne(reportCard.pourcentage) }}%
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

function formatMoyenne(avg) {
  if (avg == null || Number.isNaN(Number(avg))) return '—'
  return Number(avg).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
import { useAuthStore } from '@/stores/auth'
import {
  getReportCard,
  downloadPdf as apiDownloadPdf,
  validerParPrefet,
  validerParDirecteur,
  signerBulletin,
  publierBulletin,
} from '@/api/report-cards'
import { Shield, UserCheck, Signature, Send } from 'lucide-vue-next'

const route = useRoute()
const reportCard = ref(null)
const authStore = useAuthStore()
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const actions = ref({
  prefet: false,
  directeur: false,
  sign: false,
  publish: false
})

const reportCardId = () => Number(route.params.id)

// The server remains authoritative; these guards mirror its workflow transitions.
// They prevent users from starting actions that the backend would reject.
const canValidatePrefet = computed(() =>
  reportCard.value?.statut === 'BROUILLON' && (authStore.isPrefet || authStore.isDirection)
)
const canValidateDirecteur = computed(() =>
  reportCard.value?.statut === 'VALIDE_PREFET' &&
  (authStore.isDirecteur || authStore.isAdminRole || authStore.isSuperAdmin)
)
const canSign = computed(() =>
  reportCard.value?.statut === 'VALIDE_DIRECTEUR' &&
  (authStore.isDirecteur || authStore.isAdminRole || authStore.isSuperAdmin)
)
const canPublish = computed(() =>
  reportCard.value?.statut === 'SIGNE' && authStore.isDirection
)

async function loadReportCard() {
  loading.value = true
  error.value = null
  try {
    reportCard.value = await getReportCard(reportCardId())
  } catch (e) {
    console.error('Erreur lors du chargement du bulletin', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du chargement du bulletin'
  } finally {
    loading.value = false
  }
}

async function downloadPdf() {
  error.value = null
  try {
    const blob = await apiDownloadPdf(reportCardId())
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bulletin-${route.params.id}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (e) {
    console.error('Erreur lors du téléchargement du PDF', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du téléchargement du PDF'
  }
}

/** Exécute une action de workflow puis recharge le bulletin (statut à jour) */
async function runWorkflow(actionKey, fn, successMessage) {
  actions.value[actionKey] = true
  error.value = null
  success.value = null
  try {
    const result = await fn(reportCardId())
    if (reportCard.value && result?.statut) {
      reportCard.value.statut = result.statut
    }
    success.value = successMessage
    // Recharge pour synchroniser l'ensemble des données (timestamps, statut)
    await loadReportCard()
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  } finally {
    actions.value[actionKey] = false
  }
}

const validatePrefet = () => runWorkflow('prefet', validerParPrefet, 'Bulletin validé par le préfet')
const validateDirecteur = () => runWorkflow('directeur', validerParDirecteur, 'Bulletin validé par le directeur')
const sign = () => runWorkflow('sign', signerBulletin, 'Bulletin signé')
const publish = () => runWorkflow('publish', publierBulletin, 'Bulletin publié')

onMounted(loadReportCard)
</script>
