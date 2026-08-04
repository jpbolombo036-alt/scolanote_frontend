<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des enseignants"
      subtitle="Gestion des enseignants et liste des enseignants"
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
          class="bg-brand-500 hover:bg-brand-600 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-brand-500/20 transition-all duration-200 flex items-center justify-center gap-2"
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
            <div class="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
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
                class="p-2 text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition"
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
import { onBeforeRouteUpdate } from 'vue-router'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useRouter, useRoute } from 'vue-router'
import { UserCheck, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

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

onBeforeRouteUpdate(async (to, from) => {
  if (to.path === '/enseignants' && from.path.startsWith('/enseignants/form')) {
    await loadTeachers()
  }
})

onMounted(() => {
  loadTeachers()
})
</script>
