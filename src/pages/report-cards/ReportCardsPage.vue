<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">

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
          @click="router.push('/bulletins/nouveau')"
          class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-lg shadow-blue-600/25 transition flex items-center gap-2"
        >
          <Sparkles class="w-4 h-4" />
          <span>Générer un bulletin</span>
        </button>
      </div>
    </div>

    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <DataTableCard
      title="Liste des bulletins"
      subtitle="Gestion des bulletins et liste des bulletins"
      searchPlaceholder="Rechercher un bulletin..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredReportCards.length && !loading"
      empty-message="Aucun bulletin généré"
      :columns="columns"
      @refresh="loadReportCards"
    >
      <template #default>
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
              {{ formatMoyenne(reportCard.pourcentage ?? reportCard.moyenne) }}%
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
      </template>

      <template #footer>
        <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-4">
          <button
            @click="prevPage"
            :disabled="currentPage === 0"
            class="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Précédent
          </button>
          <span class="text-xs text-slate-500 dark:text-slate-400">
            Page {{ currentPage + 1 }} / {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage >= totalPages - 1"
            class="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Suivant
          </button>
        </div>
      </template>
    </DataTableCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import { FileText, Sparkles, AlertCircle, Download } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'

function formatMoyenne(avg) {
  if (avg == null || Number.isNaN(Number(avg))) return '—'
  return Number(avg).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const router = useRouter()
const route = useRoute()

const reportCards = ref([])
const classrooms = ref([])
const periods = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const classroomId = ref('')
const periodId = ref('')

const currentPage = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)

const columns = [
  { key: 'student', label: 'Élève' },
  { key: 'classroom', label: 'Classe' },
  { key: 'period', label: 'Période' },
  { key: 'moyenne', label: 'Moyenne' },
  { key: 'mention', label: 'Mention' },
  { key: 'rang', label: 'Rang' },
  { key: 'pdf', label: 'PDF', headerClass: 'text-right' }
]

const filteredReportCards = computed(() => {
  if (!searchQuery.value) return reportCards.value
  const q = searchQuery.value.toLowerCase()
  return reportCards.value.filter(r =>
    (r.studentNom && r.studentNom.toLowerCase().includes(q)) ||
    (r.classroomNom && r.classroomNom.toLowerCase().includes(q)) ||
    (r.periodNom && r.periodNom.toLowerCase().includes(q))
  )
})

onBeforeRouteUpdate(async (to, from) => {
  if (to.path === '/bulletins' && from.path.startsWith('/bulletins/nouveau')) {
    await loadReportCards()
  }
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
    const response = await api.get('/api/bulletins', {
      params: {
        page: currentPage.value,
        size: pageSize.value,
        sort: 'id,desc'
      }
    })
    const data = response.data
    if (data.content) {
      reportCards.value = data.content
      totalPages.value = data.totalPages
      totalElements.value = data.totalElements
    } else {
      reportCards.value = Array.isArray(data) ? data : (data.content || [])
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement des bulletins'
  } finally {
    loading.value = false
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    loadReportCards()
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    loadReportCards()
  }
}

function onSearchChange() {
  currentPage.value = 0
  loadReportCards()
}

watch(searchQuery, onSearchChange)

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
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du téléchargement du PDF'
  }
}
</script>
