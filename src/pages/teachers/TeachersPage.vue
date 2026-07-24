<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- PAGE HEADER BAR -->
    <div class="hidden lg:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Professeurs</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestion du corps enseignant et spécialités</p>
      </div>
    </div>

    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- Mobile Header + Search -->
    <div class="lg:hidden flex gap-2">
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un enseignant..."
          class="w-full bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium pl-10 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 transition"
        />
      </div>
      <button
        @click="openCreateForm"
        class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center"
      >
        <UserCheck class="w-5 h-5" />
      </button>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des enseignants"
      searchPlaceholder="Rechercher un enseignant..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredTeachers.length && !loading"
      empty-message="Aucun enseignant trouvé"
      :columns="columns"
      @refresh="loadTeachers"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <UserCheck class="w-4 h-4" />
          <span class="hidden sm:inline">Nouveau professeur</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="teacher in filteredTeachers"
          :key="teacher.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              {{ (teacher.nom || 'P').substring(0, 1).toUpperCase() }}
            </div>
            <div>
              <span>{{ teacher.nom }} {{ teacher.postnom || '' }} {{ teacher.prenom || '' }}</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[11px] border border-blue-500/20">
              {{ teacher.specialite || 'Général' }}
            </span>
          </td>
          <td class="px-6 py-4 text-slate-500 dark:text-slate-400">{{ teacher.email || '-' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(teacher)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(teacher)"
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

    <!-- Mobile Cards -->
    <div class="lg:hidden space-y-3">
      <!-- Loading -->
      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
        <p class="text-xs text-slate-400 font-medium mt-3">Chargement...</p>
      </div>

      <!-- Cards -->
      <div v-else-if="filteredTeachers.length > 0" class="space-y-3">
        <div
          v-for="teacher in filteredTeachers"
          :key="teacher.id"
          class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-sm">
                {{ (teacher.nom || 'P').substring(0, 1).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900 dark:text-white">{{ teacher.nom }} {{ teacher.postnom || '' }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ teacher.specialite || 'Général' }}</p>
              </div>
            </div>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 font-semibold text-[10px] border border-blue-500/20">
              {{ teacher.specialite ? teacher.specialite.substring(0, 3).toUpperCase() : 'GEN' }}
            </span>
          </div>
          <div class="text-xs text-slate-500 dark:text-slate-400 mb-3">
            {{ teacher.email || 'N/A' }}
          </div>
          <div class="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              @click="openEditForm(teacher)"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 transition"
            >
              <Edit3 class="w-3.5 h-3.5" />
              Modifier
            </button>
            <button
              @click="confirmDelete(teacher)"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition"
            >
              <Trash2 class="w-3.5 h-3.5" />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State Mobile -->
      <EmptyState v-else message="Aucun enseignant trouvé" />

      <!-- Mobile Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 0"
          class="flex-1 mx-1 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#0d1527] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Précédent
        </button>
        <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {{ currentPage + 1 }}/{{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages - 1"
          class="flex-1 mx-1 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#0d1527] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Suivant
        </button>
      </div>
    </div>

    <ConfirmDialog
      :show="showConfirm"
      title="Supprimer l'enseignant"
      :message="`Êtes-vous sûr de vouloir supprimer '${teacherToDelete?.nom}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteTeacher"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useRouter } from 'vue-router'
import { UserCheck, Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'

const router = useRouter()

const teachers = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const teacherToDelete = ref(null)

const currentPage = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)

const columns = [
  { key: 'nom', label: 'Nom & Prénom' },
  { key: 'specialite', label: 'Spécialité' },
  { key: 'email', label: 'Email' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredTeachers = computed(() => {
  if (!searchQuery.value) return teachers.value
  const q = searchQuery.value.toLowerCase()
  return teachers.value.filter(t =>
    (t.nom && t.nom.toLowerCase().includes(q)) ||
    (t.postnom && t.postnom.toLowerCase().includes(q)) ||
    (t.specialite && t.specialite.toLowerCase().includes(q))
  )
})

async function loadTeachers() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/enseignants', {
      params: {
        page: currentPage.value,
        size: pageSize.value,
        sort: 'id,desc'
      }
    })
    const data = response.data
    if (data.content) {
      teachers.value = data.content
      totalPages.value = data.totalPages
      totalElements.value = data.totalElements
    } else {
      teachers.value = Array.isArray(data) ? data : (data.content || [])
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement des enseignants'
  } finally {
    loading.value = false
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    loadTeachers()
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    loadTeachers()
  }
}

watch(searchQuery, () => {
  currentPage.value = 0
  loadTeachers()
})

function openCreateForm() {
  router.push('/enseignants/form')
}

function openEditForm(teacher) {
  router.push(`/enseignants/form/${teacher.id}`)
}

function confirmDelete(teacher) {
  teacherToDelete.value = teacher
  showConfirm.value = true
}

async function deleteTeacher() {
  if (!teacherToDelete.value) return
  try {
    await api.delete(`/api/enseignants/${teacherToDelete.value.id}`)
    showConfirm.value = false
    teacherToDelete.value = null
    await loadTeachers()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

onMounted(() => {
  loadTeachers()
})
</script>
