<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">



    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des évaluations"
      subtitle="Gestion des évaluations et liste des évaluations"
      searchPlaceholder="Rechercher une évaluation..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredAssessments.length && !loading"
      empty-message="Aucune évaluation trouvée"
      :columns="columns"
      @refresh="loadAssessments"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span>Nouvelle évaluation</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="assessment in filteredAssessments"
          :key="assessment.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ assessment.titre }}</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[11px] border border-blue-500/20">
              {{ assessment.assessmentTypeNom || '-' }}
            </span>
          </td>
          <td class="px-6 py-4">{{ assessment.periodNom || '-' }}</td>
          <td class="px-6 py-4">{{ assessment.noteMax || '-' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(assessment)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(assessment)"
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
      title="Supprimer l'évaluation"
      :message="`Êtes-vous sûr de vouloir supprimer '${assessmentToDelete?.titre}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteAssessment"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { Plus, Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const assessments = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const assessmentToDelete = ref(null)

const columns = [
  { key: 'titre', label: 'Titre' },
  { key: 'assessmentType', label: 'Type' },
  { key: 'period', label: 'Période' },
  { key: 'noteMax', label: 'Note max' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredAssessments = computed(() => {
  if (!searchQuery.value) return assessments.value
  const q = searchQuery.value.toLowerCase()
  return assessments.value.filter(a =>
    (a.titre && a.titre.toLowerCase().includes(q)) ||
    (a.assessmentTypeNom && a.assessmentTypeNom.toLowerCase().includes(q))
  )
})

async function loadAssessments() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/evaluations')
    assessments.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement des évaluations'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/evaluations/form')
}

function openEditForm(assessment) {
  router.push(`/evaluations/form/${assessment.id}`)
}

function confirmDelete(assessment) {
  assessmentToDelete.value = assessment
  showConfirm.value = true
}

async function deleteAssessment() {
  if (!assessmentToDelete.value) return
  try {
    await api.delete(`/api/evaluations/${assessmentToDelete.value.id}`)
    showConfirm.value = false
    assessmentToDelete.value = null
    await loadAssessments()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

onBeforeRouteUpdate(async (to, from) => {
  if (to.path === '/evaluations' && from.path.startsWith('/evaluations/form')) {
    await loadAssessments()
  }
})

onMounted(() => {
  loadAssessments()
})
</script>
