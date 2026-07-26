<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <DataTableCard
      title="Liste des notes"
      subtitle="Gestion des notes et liste des notes"
      searchPlaceholder="Rechercher une note..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredGrades.length && !loading"
      empty-message="Aucune note trouvée"
      :columns="columns"
      @refresh="loadGrades"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span>Nouvelle note</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="grade in filteredGrades"
          :key="grade.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ grade.studentNom || '-' }}</td>
          <td class="px-6 py-4">{{ grade.assessment?.titre || grade.assessmentId || '-' }}</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/20">
              {{ grade.note || '-' }}
            </span>
          </td>
          <td class="px-6 py-4">
            <span :class="grade.absence ? 'text-red-600' : 'text-emerald-600'">
              {{ grade.absence ? 'Oui' : 'Non' }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(grade)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(grade)"
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

    <!-- CONFIRM DELETE DIALOG -->
    <ConfirmDialog
      :show="showConfirm"
      title="Supprimer la note"
      :message="`Êtes-vous sûr de vouloir supprimer cette note ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteGrade"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { Plus, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const grades = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const gradeToDelete = ref(null)

const currentPage = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)

const columns = [
  { key: 'student', label: 'Élève' },
  { key: 'assessment', label: 'Évaluation' },
  { key: 'note', label: 'Note' },
  { key: 'absence', label: 'Absence' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredGrades = computed(() => {
  if (!searchQuery.value) return grades.value
  const q = searchQuery.value.toLowerCase()
  return grades.value.filter(g =>
    (g.studentNom && g.studentNom.toLowerCase().includes(q))
  )
})

async function loadGrades() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/notes', {
      params: {
        page: currentPage.value,
        size: pageSize.value,
        sort: 'id,desc'
      }
    })
    const data = response.data
    if (data.content) {
      grades.value = data.content
      totalPages.value = data.totalPages
      totalElements.value = data.totalElements
    } else {
      grades.value = Array.isArray(data) ? data : (data.content || [])
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    loadGrades()
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    loadGrades()
  }
}

function onSearchChange() {
  currentPage.value = 0
  loadGrades()
}

watch(searchQuery, onSearchChange)

function openCreateForm() {
  router.push('/notes/form')
}

function openEditForm(grade) {
  router.push(`/notes/form/${grade.id}`)
}

function confirmDelete(grade) {
  gradeToDelete.value = grade
  showConfirm.value = true
}

async function deleteGrade() {
  if (!gradeToDelete.value) return
  try {
    await api.delete(`/api/notes/${gradeToDelete.value.id}`)
    showConfirm.value = false
    gradeToDelete.value = null
    await loadGrades()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  }
}

onMounted(() => {
  loadGrades()
})
</script>
