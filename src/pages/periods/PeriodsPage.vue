<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- PAGE HEADER BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Périodes</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestion des périodes scolaires</p>
      </div>
    </div>

    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des périodes"
      subtitle="Consultez et gérez vos périodes"
      searchPlaceholder="Rechercher une période..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredPeriods.length && !loading"
      empty-message="Aucune période trouvée"
      :columns="columns"
      @refresh="loadPeriods"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span>Nouvelle période</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="period in filteredPeriods"
          :key="period.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ period.nom }}</td>
          <td class="px-6 py-4">{{ period.trimester?.nom || period.trimesterNom || '-' }}</td>
          <td class="px-6 py-4">{{ period.type || '-' }}</td>
          <td class="px-6 py-4">
            <span :class="period.verrouille ? 'text-red-600' : 'text-emerald-600'">
              {{ period.verrouille ? 'Oui' : 'Non' }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(period)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(period)"
                class="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                title="Supprimer"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </DataTableCard>

    <!-- CONFIRM DELETE DIALOG -->
    <ConfirmDialog
      :show="showConfirm"
      title="Supprimer la période"
      :message="`Êtes-vous sûr de vouloir supprimer '${periodToDelete?.nom}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deletePeriod"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { Plus, Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const periods = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const periodToDelete = ref(null)

const columns = [
  { key: 'nom', label: 'Nom' },
  { key: 'trimester', label: 'Trimestre' },
  { key: 'type', label: 'Type' },
  { key: 'verrouille', label: 'Verrouillée' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredPeriods = computed(() => {
  if (!searchQuery.value) return periods.value
  const q = searchQuery.value.toLowerCase()
  return periods.value.filter(p =>
    (p.nom && p.nom.toLowerCase().includes(q))
  )
})

async function loadPeriods() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/periodes')
    periods.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    console.error('Erreur lors du chargement des périodes', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/periodes/form')
}

function openEditForm(period) {
  router.push(`/periodes/form/${period.id}`)
}

function confirmDelete(period) {
  periodToDelete.value = period
  showConfirm.value = true
}

async function deletePeriod() {
  if (!periodToDelete.value) return
  try {
    await api.delete(`/api/periodes/${periodToDelete.value.id}`)
    showConfirm.value = false
    periodToDelete.value = null
    await loadPeriods()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  }
}

onMounted(() => {
  loadPeriods()
})
</script>
