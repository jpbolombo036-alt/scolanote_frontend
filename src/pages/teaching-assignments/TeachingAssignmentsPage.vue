<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <DataTableCard
      title="Liste des affectations"
      subtitle="Gestion des affectations et liste des affectations"
      search-placeholder="Rechercher une affectation..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredAssignments.length && !loading"
      empty-message="Aucune affectation trouvée"
      :columns="columns"
      @refresh="loadAssignments"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span class="hidden sm:inline">Nouvelle affectation</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="assignment in filteredAssignments"
          :key="assignment.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ assignment.teacher?.nom || assignment.teacherId || '-' }}</td>
          <td class="px-6 py-4">{{ assignment.classroom?.nom || assignment.classroomId || '-' }}</td>
          <td class="px-6 py-4">{{ assignment.subject?.nom || assignment.subjectId || '-' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(assignment)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(assignment)"
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

    <!-- CONFIRM DELETE DIALOG -->
    <ConfirmDialog
      :show="showConfirm"
      title="Supprimer l'affectation"
      :message="`Êtes-vous sûr de vouloir supprimer cette affectation ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteAssignment"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { Plus, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const assignments = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const assignmentToDelete = ref(null)

const pagination = ref({
  page: 0,
  size: 10,
  totalPages: 1,
  totalElements: 0
})

const columns = [
  { key: 'teacher', label: 'Professeur' },
  { key: 'classroom', label: 'Classe' },
  { key: 'subject', label: 'Matière' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredAssignments = computed(() => {
  if (!searchQuery.value) return assignments.value
  const q = searchQuery.value.toLowerCase()
  return assignments.value.filter(a =>
    (a.teacher?.nom && a.teacher.nom.toLowerCase().includes(q)) ||
    (a.classroom?.nom && a.classroom.nom.toLowerCase().includes(q)) ||
    (a.subject?.nom && a.subject.nom.toLowerCase().includes(q))
  )
})

async function loadAssignments() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/attributions-enseignement', {
      params: {
        page: pagination.value.page,
        size: pagination.value.size
      }
    })
    if (response.data.content) {
      assignments.value = response.data.content
      pagination.value.totalPages = response.data.totalPages || 1
      pagination.value.totalElements = response.data.totalElements || assignments.value.length
    } else if (Array.isArray(response.data)) {
      assignments.value = response.data
      pagination.value.totalPages = 1
      pagination.value.totalElements = response.data.length
    }
  } catch (e) {
    console.error('Erreur lors du chargement des affectations', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du chargement des affectations'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/attributions/form')
}

function openEditForm(assignment) {
  router.push(`/attributions/form/${assignment.id}`)
}

function confirmDelete(assignment) {
  assignmentToDelete.value = assignment
  showConfirm.value = true
}

async function deleteAssignment() {
  if (!assignmentToDelete.value) return
  try {
    await api.delete(`/api/attributions-enseignement/${assignmentToDelete.value.id}`)
    showConfirm.value = false
    assignmentToDelete.value = null
    await loadAssignments()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  }
}

function onPageChange(page) {
  if (page < 0 || page >= pagination.value.totalPages) return
  pagination.value.page = page
  loadAssignments()
}

onMounted(() => {
  loadAssignments()
})
</script>
