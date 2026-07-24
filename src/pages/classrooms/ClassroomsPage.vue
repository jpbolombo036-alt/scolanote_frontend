<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- PAGE HEADER BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Classes</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestion des salles et classes</p>
      </div>
      <button
        @click="openCreateForm"
        class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Plus class="w-4 h-4" />
        <span>Nouvelle classe</span>
      </button>
    </div>

    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des classes"
      subtitle="Consultez et gérez vos classes"
      searchPlaceholder="Rechercher une classe..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredClassrooms.length && !loading"
      empty-message="Aucune classe trouvée"
      :columns="columns"
      @refresh="loadClassrooms"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span class="hidden sm:inline">Nouvelle classe</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="classroom in filteredClassrooms"
          :key="classroom.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center space-x-3">
            <div class="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
              {{ (classroom.nom || 'C').substring(0, 2).toUpperCase() }}
            </div>
            <span>{{ classroom.nom }}</span>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
              {{ classroom.code || '-' }}
            </span>
          </td>
          <td class="px-6 py-4">{{ classroom.academicYear?.libelle || classroom.academicYearId || '-' }}</td>
          <td class="px-6 py-4">{{ classroom.level?.nom || classroom.levelId || '-' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(classroom)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(classroom)"
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
      title="Supprimer la classe"
      :message="`Êtes-vous sûr de vouloir supprimer '${classroomToDelete?.nom}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteClassroom"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { Plus, Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const classrooms = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const classroomToDelete = ref(null)

const pagination = ref({
  page: 0,
  size: 10,
  totalPages: 1,
  totalElements: 0
})

const columns = [
  { key: 'nom', label: 'Nom' },
  { key: 'code', label: 'Code' },
  { key: 'academicYear', label: 'Année scolaire' },
  { key: 'level', label: 'Niveau' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredClassrooms = computed(() => {
  if (!searchQuery.value) return classrooms.value
  const q = searchQuery.value.toLowerCase()
  return classrooms.value.filter(c =>
    (c.nom && c.nom.toLowerCase().includes(q)) ||
    (c.code && String(c.code).toLowerCase().includes(q))
  )
})

async function loadClassrooms() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/salles', {
      params: {
        page: pagination.value.page,
        size: pagination.value.size
      }
    })
    if (response.data.content) {
      classrooms.value = response.data.content
      pagination.value.totalPages = response.data.totalPages || 1
      pagination.value.totalElements = response.data.totalElements || classrooms.value.length
    } else if (Array.isArray(response.data)) {
      classrooms.value = response.data
      pagination.value.totalPages = 1
      pagination.value.totalElements = response.data.length
    }
  } catch (e) {
    console.error('Erreur lors du chargement des salles', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du chargement des salles'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/salles/form')
}

function openEditForm(classroom) {
  router.push(`/salles/form/${classroom.id}`)
}

function confirmDelete(classroom) {
  classroomToDelete.value = classroom
  showConfirm.value = true
}

async function deleteClassroom() {
  if (!classroomToDelete.value) return
  try {
    await api.delete(`/api/salles/${classroomToDelete.value.id}`)
    showConfirm.value = false
    classroomToDelete.value = null
    await loadClassrooms()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

function onPageChange(page) {
  if (page < 0 || page >= pagination.value.totalPages) return
  pagination.value.page = page
  loadClassrooms()
}

onMounted(() => {
  loadClassrooms()
})
</script>
