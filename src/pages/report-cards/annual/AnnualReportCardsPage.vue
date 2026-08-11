<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-ink tracking-tight">Bulletins annuels</h1>
        <p class="text-sm text-ink-muted mt-1">Génération et consultation des bulletins annuels</p>
      </div>
      <router-link
        to="/bulletins-annuels/nouveau"
        class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 shadow-md shadow-brand-500/25 transition"
      >
        <Plus class="w-4 h-4" />
        <span class="hidden sm:inline">Générer un bulletin annuel</span>
        <span class="sm:hidden">Générer</span>
      </router-link>
    </div>

    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <DataTableCard
      title="Liste des bulletins annuels"
      subtitle="Tous les bulletins annuels générés"
      search-placeholder="Rechercher un bulletin annuel..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredReportCards.length && !loading"
      empty-message="Aucun bulletin annuel généré"
      :columns="columns"
      @refresh="loadReportCards"
    >
      <template #default>
        <tr
          v-for="reportCard in filteredReportCards"
          :key="reportCard.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ reportCard.studentNom || '—' }}</td>
          <td class="px-6 py-4">{{ reportCard.classroomNom || '—' }}</td>
          <td class="px-6 py-4">{{ reportCard.academicYearNom || '—' }}</td>
          <td class="px-6 py-4">
            <span :class="['font-bold', moyenneColor(reportCard.pourcentage)]">{{ formatMoyenne(reportCard.pourcentage) }}</span>
          </td>
          <td class="px-6 py-4">
            <span :class="['inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold', mentionBadge(reportCard.mention)]">
              {{ reportCard.mention || '—' }}
            </span>
          </td>
          <td class="px-6 py-4 text-ink-soft">{{ formatDate(reportCard.dateGeneration) }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end gap-1">
              <router-link :to="`/bulletins-annuels/${reportCard.id}`" class="p-2 rounded-lg text-brand-500 hover:bg-brand-50 transition" title="Voir">
                <Eye class="w-4 h-4" />
              </router-link>
            </div>
          </td>
        </tr>
      </template>

      <template #footer>
        <Pagination
          v-if="pagination.totalPages > 1"
          :page="pagination.page"
          :size="pagination.size"
          :totalElements="pagination.totalElements"
          :totalPages="pagination.totalPages"
          @prev="onPageChange(pagination.page - 1)"
          @next="onPageChange(pagination.page + 1)"
          @goTo="onPageChange"
        />
      </template>
    </DataTableCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import { Plus, AlertCircle, Eye } from 'lucide-vue-next'
import { getAcademicYearReportCards } from '@/api/report-cards'

const reportCards = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const pollTimer = ref(null)
const isPolling = ref(false)

const pagination = ref({
  page: 0,
  size: 10,
  totalPages: 1,
  totalElements: 0
})

const columns = [
  { key: 'studentNom', label: 'Élève' },
  { key: 'classroomNom', label: 'Classe' },
  { key: 'academicYearNom', label: 'Année scolaire' },
  { key: 'moyenneGenerale', label: 'Moyenne' },
  { key: 'mention', label: 'Mention' },
  { key: 'dateGeneration', label: 'Date' },
  { key: 'actions', label: 'Actions', headerClass: 'px-6 py-4 text-right' }
]

const filteredReportCards = computed(() => {
  if (!searchQuery.value) return reportCards.value
  const q = searchQuery.value.toLowerCase()
  return reportCards.value.filter(rc => {
    const name = String(rc.studentNom || rc.eleveNomComplet || '').toLowerCase()
    const classe = String(rc.classroomNom || '').toLowerCase()
    return name.includes(q) || classe.includes(q)
  })
})

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

function mentionBadge(mention) {
  const map = {
    'Très Bien': 'bg-emerald-50 text-emerald-700',
    'Bien': 'bg-blue-50 text-blue-700',
    'Assez Bien': 'bg-amber-50 text-amber-700',
    'Passable': 'bg-rose-50 text-rose-600',
    'Insuffisant': 'bg-red-50 text-red-600'
  }
  return map[mention] || 'bg-slate-100 text-slate-600'
}

function moyenneColor(avg) {
  if (avg == null) return 'text-ink-soft'
  if (avg >= 14) return 'text-emerald-600'
  if (avg >= 10) return 'text-amber-600'
  return 'text-red-500'
}

async function loadReportCards() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/bulletins-annuels', {
      params: {
        page: pagination.value.page,
        size: pagination.value.size,
        sort: 'id,desc'
      }
    })
    const data = response.data
    const previousTotal = pagination.value.totalElements
    reportCards.value = data.content || []
    pagination.value.totalPages = data.totalPages || 1
    pagination.value.totalElements = data.totalElements || 0

    if (isPolling.value && data.totalElements > previousTotal && previousTotal > 0) {
      stopPolling()
    }
  } catch (e) {
    reportCards.value = []
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du chargement des bulletins annuels'
  } finally {
    loading.value = false
  }
}

function startPolling() {
  if (pollTimer.value) return
  isPolling.value = true
  pollTimer.value = setInterval(() => {
    loadReportCards()
  }, 4000)
}

function stopPolling() {
  if (pollTimer.value) {
    clearInterval(pollTimer.value)
    pollTimer.value = null
  }
  isPolling.value = false
}

onMounted(() => {
  loadReportCards()
  startPolling()
})

onBeforeUnmount(() => {
  stopPolling()
})
</script>
