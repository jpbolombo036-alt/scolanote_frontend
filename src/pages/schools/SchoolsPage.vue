<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">



    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des écoles"
      searchPlaceholder="Rechercher une école..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredSchools.length && !loading"
      empty-message="Aucune école trouvée"
      :columns="columns"
      @refresh="loadSchools"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span>Nouvelle école</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="school in filteredSchools"
          :key="school.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center space-x-3">
            <div class="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
              {{ (school.nom || 'E').substring(0, 2).toUpperCase() }}
            </div>
            <span>{{ school.nom }}</span>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
              {{ school.code || '-' }}
            </span>
          </td>
          <td class="px-6 py-4">{{ school.province || '-' }}</td>
          <td class="px-6 py-4">{{ school.communeTerritoire || '-' }}</td>
          <td class="px-6 py-4 text-slate-500 dark:text-slate-400">{{ school.email || '-' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(school)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(school)"
                class="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                title="Supprimer"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </template>

      <template #footer>
        <Pagination
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

    <!-- CONFIRM DELETE DIALOG -->
    <ConfirmDialog
      :show="showConfirm"
      title="Supprimer l'école"
      :message="`Êtes-vous sûr de vouloir supprimer '${schoolToDelete?.nom}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteSchool"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { Plus, Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const schools = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const schoolToDelete = ref(null)

const pagination = ref({
  page: 0,
  size: 10,
  totalPages: 1,
  totalElements: 0
})

const columns = [
  { key: 'nom', label: 'Nom de l\'école' },
  { key: 'code', label: 'Code' },
  { key: 'province', label: 'Province' },
  { key: 'communeTerritoire', label: 'Commune / Territoire' },
  { key: 'email', label: 'Email' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredSchools = computed(() => {
  if (!searchQuery.value) return schools.value
  const q = searchQuery.value.toLowerCase()
  return schools.value.filter(s =>
    (s.nom && s.nom.toLowerCase().includes(q)) ||
    (s.code && s.code.toLowerCase().includes(q)) ||
    (s.province && s.province.toLowerCase().includes(q))
  )
})

async function loadSchools() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/ecoles', {
      params: {
        page: pagination.value.page,
        size: pagination.value.size
      }
    })

    if (response.data.content) {
      schools.value = response.data.content
      pagination.value.totalPages = response.data.totalPages || 1
      pagination.value.totalElements = response.data.totalElements || schools.value.length
    } else if (Array.isArray(response.data)) {
      schools.value = response.data
      pagination.value.totalPages = 1
      pagination.value.totalElements = response.data.length
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement des écoles'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/ecoles/form')
}

function openEditForm(school) {
  router.push(`/ecoles/form/${school.id}`)
}

function confirmDelete(school) {
  schoolToDelete.value = school
  showConfirm.value = true
}

async function deleteSchool() {
  if (!schoolToDelete.value) return
  try {
    await api.delete(`/api/ecoles/${schoolToDelete.value.id}`)
    showConfirm.value = false
    schoolToDelete.value = null
    await loadSchools()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

function onPageChange(page) {
  if (page < 0 || page >= pagination.value.totalPages) return
  pagination.value.page = page
  loadSchools()
}

onMounted(() => {
  loadSchools()
})
</script>
