<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- PAGE HEADER BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Bulletins Scolaires</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Génération et impression des bulletins de notes</p>
      </div>
    </div>

    <!-- GENERATION CARD PANEL -->
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-xl space-y-4 transition-colors duration-200">
      <div class="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div class="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
          <FileText class="w-5 h-5" />
        </div>
        <h2 class="text-base font-bold text-slate-900 dark:text-white">Générer des bulletins</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
        <div>
          <label class="block mb-1.5 font-semibold">Classe <span class="text-red-500">*</span></label>
          <select
            v-model="classroomId"
            class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition"
          >
            <option value="">Sélectionner une classe</option>
            <option v-for="c in classrooms" :key="c.id" :value="c.id">{{ c.nom }}</option>
          </select>
        </div>
        <div>
          <label class="block mb-1.5 font-semibold">Période <span class="text-red-500">*</span></label>
          <select
            v-model="periodId"
            class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition"
          >
            <option value="">Sélectionner une période</option>
            <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.nom }}</option>
          </select>
        </div>
      </div>

      <div class="pt-2 flex justify-end">
        <button
          @click="generateBulletins"
          :disabled="generating"
          class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-lg shadow-blue-600/25 transition flex items-center gap-2 disabled:opacity-60"
        >
          <Sparkles :class="['w-4 h-4', { 'animate-spin': generating }]" />
          <span>{{ generating ? 'Génération en cours...' : 'Générer les bulletins' }}</span>
        </button>
      </div>
    </div>

    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CONTAINER -->
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-xl overflow-hidden transition-colors duration-200">
      
      <!-- Table Header Bar / Search -->
      <div class="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative w-full sm:w-72">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un bulletin..."
            class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-emerald-500 transition"
          />
        </div>

        <button
          @click="loadReportCards"
          class="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition"
          title="Actualiser"
        >
          <RefreshCw :class="['w-4 h-4', { 'animate-spin': loading }]" />
        </button>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        <p class="text-xs text-slate-400 font-medium mt-3">Chargement des bulletins...</p>
      </div>

      <!-- Table Content -->
      <div v-else-if="filteredReportCards.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th class="px-6 py-4">Élève</th>
              <th class="px-6 py-4">Classe</th>
              <th class="px-6 py-4">Période</th>
              <th class="px-6 py-4">Moyenne</th>
              <th class="px-6 py-4">Mention</th>
              <th class="px-6 py-4">Rang</th>
              <th class="px-6 py-4 text-right">PDF</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <tr
              v-for="reportCard in filteredReportCards"
              :key="reportCard.id"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
            >
              <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">
                {{ reportCard.studentNom || reportCard.student?.nom || '-' }}
              </td>
              <td class="px-6 py-4">{{ reportCard.classroomNom || reportCard.classroom?.nom || '-' }}</td>
              <td class="px-6 py-4">{{ reportCard.periodNom || reportCard.period?.nom || '-' }}</td>
              <td class="px-6 py-4">
                <span class="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {{ reportCard.pourcentage || reportCard.moyenne || 0 }}%
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[11px] border border-blue-500/20">
                  {{ reportCard.mention || 'Satisfaction' }}
                </span>
              </td>
              <td class="px-6 py-4 font-mono font-bold">{{ reportCard.rang || '-' }}</td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="viewPdf(reportCard.id)"
                  class="p-2 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition inline-flex items-center gap-1 font-bold text-xs"
                >
                  <Download class="w-4 h-4" />
                  <span>PDF</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <EmptyState v-else message="Aucun bulletin généré" />

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import EmptyState from '@/components/common/EmptyState.vue'
import { FileText, Sparkles, Search, RefreshCw, AlertCircle, Download } from 'lucide-vue-next'

const reportCards = ref([])
const classrooms = ref([])
const periods = ref([])
const classroomId = ref('')
const periodId = ref('')
const loading = ref(false)
const error = ref(null)
const generating = ref(false)
const searchQuery = ref('')

const filteredReportCards = computed(() => {
  if (!searchQuery.value) return reportCards.value
  const q = searchQuery.value.toLowerCase()
  return reportCards.value.filter(r =>
    (r.studentNom && r.studentNom.toLowerCase().includes(q)) ||
    (r.classroomNom && r.classroomNom.toLowerCase().includes(q)) ||
    (r.periodNom && r.periodNom.toLowerCase().includes(q))
  )
})

onMounted(async () => {
  await Promise.all([loadClassrooms(), loadPeriods(), loadReportCards()])
})

async function loadClassrooms() {
  try {
    const response = await api.get('/api/salles')
    classrooms.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    console.error('Erreur chargement classes', e)
  }
}

async function loadPeriods() {
  try {
    const response = await api.get('/api/periodes')
    periods.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    console.error('Erreur chargement périodes', e)
  }
}

async function loadReportCards() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/bulletins')
    reportCards.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement des bulletins'
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
    await api.post('/api/bulletins/generer', {
      classroomId: classroomId.value,
      periodId: periodId.value
    })
    await loadReportCards()
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de la génération'
  } finally {
    generating.value = false
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
    alert(e.response?.data?.message || 'Erreur lors du téléchargement du PDF')
  }
}
</script>
