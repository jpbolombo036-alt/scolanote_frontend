<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">


    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des années scolaires"
      subtitle="Gestion des années scolaires et liste des années scolaires"
      searchPlaceholder="Rechercher une année..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredAcademicYears.length && !loading"
      empty-message="Aucune année scolaire trouvée"
      :columns="columns"
      @refresh="loadAcademicYears"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-brand-500 hover:bg-brand-600 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-brand-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span>Nouvelle année</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="year in filteredAcademicYears"
          :key="year.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ year.libelle }}</td>
          <td class="px-6 py-4">{{ year.school?.nom || year.schoolId || '-' }}</td>
          <td class="px-6 py-4">{{ year.dateDebut || '-' }}</td>
          <td class="px-6 py-4">{{ year.dateFin || '-' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(year)"
                class="p-2 text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(year)"
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
      title="Supprimer l'année scolaire"
      :message="`Êtes-vous sûr de vouloir supprimer '${yearToDelete?.libelle}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteAcademicYear"
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

const academicYears = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const yearToDelete = ref(null)

const columns = [
  { key: 'libelle', label: 'Libellé' },
  { key: 'school', label: 'École' },
  { key: 'dateDebut', label: 'Date début' },
  { key: 'dateFin', label: 'Date fin' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredAcademicYears = computed(() => {
  if (!searchQuery.value) return academicYears.value
  const q = searchQuery.value.toLowerCase()
  return academicYears.value.filter(y =>
    (y.libelle && y.libelle.toLowerCase().includes(q))
  )
})

async function loadAcademicYears() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/annees-academiques')
    academicYears.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    console.error('Erreur lors du chargement des années scolaires', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/annees-academiques/form')
}

function openEditForm(year) {
  router.push(`/annees-academiques/form/${year.id}`)
}

function confirmDelete(year) {
  yearToDelete.value = year
  showConfirm.value = true
}

async function deleteAcademicYear() {
  if (!yearToDelete.value) return
  try {
    await api.delete(`/api/annees-academiques/${yearToDelete.value.id}`)
    showConfirm.value = false
    yearToDelete.value = null
    await loadAcademicYears()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

onMounted(() => {
  loadAcademicYears()
})
</script>
