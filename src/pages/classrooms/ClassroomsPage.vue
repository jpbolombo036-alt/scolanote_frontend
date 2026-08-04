<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <DataTableCard
      title="Classes"
      subtitle="Gestion des classes et liste des classes"
      search-placeholder="Rechercher une classe..."
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
          class="bg-brand-500 hover:bg-brand-600 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-brand-500/20 transition-all duration-200 flex items-center justify-center gap-2"
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
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-black text-xs shrink-0">
                {{ classroomInitials(classroom) }}
              </div>
              <span>{{ classroom.nom || '—' }}</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
              {{ classroom.code || classroom.id || '—' }}
            </span>
          </td>
          <td class="px-6 py-4">{{ classroom.academicYear?.libelle || classroom.academicYearLibelle || classroom.academicYearId || '—' }}</td>
          <td class="px-6 py-4">{{ classroom.level?.nom || classroom.levelNom || classroom.levelId || '—' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(classroom)"
                class="p-2 text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition"
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

    <ConfirmDialog
      :show="showConfirm"
      title="Supprimer la classe"
      :message="`Êtes-vous sûr de vouloir supprimer '${classroomToDelete?.nom || 'cette classe'}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteClassroom"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { Plus, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

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
  { key: 'actions', label: 'Actions', headerClass: 'px-6 py-4 text-right' }
]

const filteredClassrooms = computed(() => {
  if (!searchQuery.value) return classrooms.value
  const q = searchQuery.value.toLowerCase()
  return classrooms.value.filter(c => {
    const nom = String(c.nom || '').toLowerCase()
    const code = String(c.code || c.id || '').toLowerCase()
    return nom.includes(q) || code.includes(q)
  })
})

function parseList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  return []
}

function classroomInitials(classroom) {
  const label = String(classroom?.nom || 'C').trim()
  return label.substring(0, 2).toUpperCase() || 'CL'
}

async function loadClassrooms() {
  loading.value = true
  error.value = null
  try {
    let list = []
    let totalPages = 1
    let totalElements = 0

    try {
      const response = await api.get('/api/salles', {
        params: {
          page: pagination.value.page,
          size: pagination.value.size,
          sort: 'id,desc'
        }
      })
      const data = response.data
      if (data?.content) {
        list = data.content
        totalPages = Math.max(1, data.totalPages ?? 1)
        totalElements = data.totalElements ?? list.length
      } else {
        list = parseList(data)
        totalElements = list.length
      }
    } catch (paginatedError) {
      const response = await api.get('/api/salles/all')
      list = parseList(response.data)
      totalPages = 1
      totalElements = list.length
    }

    classrooms.value = list
    pagination.value.totalPages = totalPages
    pagination.value.totalElements = totalElements
  } catch (e) {
    classrooms.value = []
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du chargement des classes'
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
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

function onPageChange(page) {
  if (page < 0 || page >= pagination.value.totalPages) return
  pagination.value.page = page
  loadClassrooms()
}

watch(
  () => route.path,
  (path, previous) => {
    if (path === '/salles' && previous?.startsWith('/salles/form')) {
      loadClassrooms()
    }
  }
)

onMounted(loadClassrooms)
</script>
