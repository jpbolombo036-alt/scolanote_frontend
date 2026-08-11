<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-xl space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <FileText class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Mes bulletins</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Consultez vos bulletins par trimestre</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <select v-model="selectedTrimesterId" class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition">
            <option value="">Tous les trimestres</option>
            <option v-for="t in trimesters" :key="t.id" :value="t.id">{{ t.nom }}</option>
          </select>
          <button @click="loadReportCards" :disabled="loading" class="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/25 transition disabled:opacity-50">
            Actualiser
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <div v-if="!loading && !error && reportCards.length === 0" class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center">
      <FileText class="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
      <p class="text-sm text-slate-500 dark:text-slate-400">Aucun bulletin disponible pour le moment.</p>
    </div>

    <div v-for="group in groupedByTrimester" :key="group.trimestreId" class="space-y-3">
      <div class="flex items-center gap-2 px-1">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white">{{ group.trimestreNom || 'Sans trimestre' }}</h3>
        <span class="text-xs text-slate-500 dark:text-slate-400">({{ group.cards.length }} bulletin{{ group.cards.length > 1 ? 's' : '' }})</span>
      </div>

      <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-xl">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
              <th class="px-6 py-3 font-semibold">Période</th>
              <th class="px-6 py-3 font-semibold">Classe</th>
              <th class="px-6 py-3 font-semibold text-right">Moyenne</th>
              <th class="px-6 py-3 font-semibold">Mention</th>
              <th class="px-6 py-3 font-semibold text-right">Rang</th>
              <th class="px-6 py-3 font-semibold text-right">PDF</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="card in group.cards" :key="card.id" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">{{ card.periodNom || '-' }}</td>
              <td class="px-6 py-4">{{ card.classroomNom || '-' }}</td>
              <td class="px-6 py-4 text-right">
                <span class="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {{ formatMoyenne(card.pourcentage ?? card.moyenne) }}%
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[11px] border border-blue-500/20">
                  {{ card.mention || 'Satisfaction' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right font-mono font-bold">{{ card.rang || '-' }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="viewPdf(card.id)" class="p-2 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition inline-flex items-center gap-1 font-bold text-xs">
                  <Download class="w-4 h-4" />
                  <span>PDF</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import { FileText, AlertCircle, Download } from 'lucide-vue-next'
import { getMyReportCards } from '@/api/report-cards'

function formatMoyenne(avg) {
  if (avg == null || Number.isNaN(Number(avg))) return '—'
  return Number(avg).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const reportCards = ref([])
const trimesters = ref([])
const loading = ref(false)
const error = ref(null)
const selectedTrimesterId = ref('')

const groupedByTrimester = computed(() => {
  const groups = new Map()
  for (const card of reportCards.value) {
    const trimester = card.period?.trimestre || null
    const key = trimester?.id || 'none'
    const nom = trimester?.nom || 'Sans trimestre'
    if (!groups.has(key)) groups.set(key, { trimestreId: key, trimestreNom: nom, cards: [] })
    groups.get(key).cards.push(card)
  }
  return Array.from(groups.values()).sort((a, b) => String(a.trimestreId).localeCompare(String(b.trimestreId)))
})

onMounted(async () => {
  await Promise.all([loadTrimesters(), loadReportCards()])
})

async function loadTrimesters() {
  try {
    const response = await api.get('/api/trimestres')
    trimesters.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    console.error('Erreur chargement trimestres', e)
  }
}

async function loadReportCards() {
  loading.value = true
  error.value = null
  try {
    const trimestreId = selectedTrimesterId.value ? Number(selectedTrimesterId.value) : undefined
    reportCards.value = await getMyReportCards(trimestreId)
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement des bulletins'
  } finally {
    loading.value = false
  }
}

async function viewPdf(id) {
  try {
    const blob = await api.post(`/api/bulletins/${id}/pdf`, {}, { responseType: 'blob' })
    const url = window.URL.createObjectURL(blob.data)
    const a = document.createElement('a')
    a.href = url
    a.download = `bulletin-${id}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (e) {
    console.error('Erreur lors du téléchargement du PDF', e)
    error.value = 'Erreur lors du téléchargement du PDF'
  }
}
</script>
