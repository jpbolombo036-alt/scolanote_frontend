<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Bulletin annuel</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accueil / Bulletins annuels / Détail</p>
      </div>
      <button @click="$router.back()" class="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Retour</button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent"></div>
    </div>

    <div v-else-if="error" class="border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600 rounded-xl">
      {{ error }}
    </div>

    <div v-else-if="reportCard" class="space-y-6">
      <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Élève</p>
            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ reportCard.studentNom || reportCard.eleveNomComplet || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Classe</p>
            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ reportCard.classroomNom || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Année scolaire</p>
            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ reportCard.academicYearNom || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Mention</p>
            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ reportCard.mention || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Décision</p>
            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ reportCard.decision || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Moyenne générale</p>
            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ formatMoyenne(reportCard.pourcentage) }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total points</p>
            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ reportCard.totalPoints != null ? Number(reportCard.totalPoints).toFixed(2) : '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Maximum points</p>
            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ reportCard.maximumPoints != null ? Number(reportCard.maximumPoints).toFixed(2) : '—' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6">
        <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4">Détail par matière</h2>
        <div v-if="!reportCard.details || reportCard.details.length === 0" class="text-sm text-slate-500">Aucun détail disponible.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-ink-muted text-xs uppercase tracking-wider bg-surface/60 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
                <th class="px-4 py-3 font-semibold">Matière</th>
                <th class="px-4 py-3 font-semibold text-center">Coeff</th>
                <th class="px-4 py-3 font-semibold text-center">1er Trim.</th>
                <th class="px-4 py-3 font-semibold text-center">2ème Trim.</th>
                <th class="px-4 py-3 font-semibold text-center">3ème Trim.</th>
                <th class="px-4 py-3 font-semibold text-center">Examen</th>
                <th class="px-4 py-3 font-semibold text-center">Moyenne</th>
                <th class="px-4 py-3 font-semibold text-center">Rang</th>
                <th class="px-4 py-3 font-semibold text-center">%</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detail in reportCard.details" :key="detail.id" class="border-t border-slate-100 dark:border-slate-800 hover:bg-surface/50 dark:hover:bg-slate-800/30 transition">
                <td class="px-4 py-3 font-semibold text-slate-900 dark:text-white">{{ detail.subjectNom || '—' }}</td>
                <td class="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{{ detail.coefficient || '—' }}</td>
                <td class="px-4 py-3 text-center" :class="moyenneColor(detail.moyenneT1)">{{ formatMoyenne(detail.moyenneT1) }}</td>
                <td class="px-4 py-3 text-center" :class="moyenneColor(detail.moyenneT2)">{{ formatMoyenne(detail.moyenneT2) }}</td>
                <td class="px-4 py-3 text-center" :class="moyenneColor(detail.moyenneT3)">{{ formatMoyenne(detail.moyenneT3) }}</td>
                <td class="px-4 py-3 text-center" :class="moyenneColor(detail.moyenneExamen)">{{ formatMoyenne(detail.moyenneExamen) }}</td>
                <td class="px-4 py-3 text-center font-bold" :class="moyenneColor(detail.moyenne)">{{ formatMoyenne(detail.moyenne) }}</td>
                <td class="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{{ detail.rangMatiere || '—' }}</td>
                <td class="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{{ detail.pourcentage != null ? Number(detail.pourcentage).toFixed(1) + '%' : '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'
import { Eye, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const reportCard = ref(null)
const loading = ref(false)
const error = ref(null)

function formatMoyenne(avg) {
  if (avg == null || Number.isNaN(Number(avg))) return '—'
  return Number(avg).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('fr-FR')
}

function moyenneColor(avg) {
  if (avg == null) return 'text-ink-soft'
  if (avg >= 14) return 'text-emerald-600'
  if (avg >= 10) return 'text-amber-600'
  return 'text-red-500'
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get(`/api/bulletins-annuels/${route.params.id}`)
    reportCard.value = response.data
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du chargement du bulletin annuel'
  } finally {
    loading.value = false
  }
})
</script>
