<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">



    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des types d'évaluation"
      subtitle="Gestion des types d'évaluation et liste des types d'évaluation"
      searchPlaceholder="Rechercher un type..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredAssessmentTypes.length && !loading"
      empty-message="Aucun type d'évaluation trouvé"
      :columns="columns"
      @refresh="loadAssessmentTypes"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span>Nouveau type</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="type in filteredAssessmentTypes"
          :key="type.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ type.nom }}</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[11px] border border-blue-500/20">
              {{ type.coefficient }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(type)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(type)"
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
      title="Supprimer le type d'évaluation"
      :message="`Êtes-vous sûr de vouloir supprimer '${typeToDelete?.nom}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteAssessmentType"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { Plus, Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const assessmentTypes = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const typeToDelete = ref(null)

const columns = [
  { key: 'nom', label: 'Nom' },
  { key: 'coefficient', label: 'Coefficient' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredAssessmentTypes = computed(() => {
  if (!searchQuery.value) return assessmentTypes.value
  const q = searchQuery.value.toLowerCase()
  return assessmentTypes.value.filter(t =>
    (t.nom && t.nom.toLowerCase().includes(q))
  )
})

async function loadAssessmentTypes() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/types-evaluations')
    assessmentTypes.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement des types'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/types-evaluations/form')
}

function openEditForm(type) {
  router.push(`/types-evaluations/form/${type.id}`)
}

function confirmDelete(type) {
  typeToDelete.value = type
  showConfirm.value = true
}

async function deleteAssessmentType() {
  if (!typeToDelete.value) return
  try {
    await api.delete(`/api/types-evaluations/${typeToDelete.value.id}`)
    showConfirm.value = false
    typeToDelete.value = null
    await loadAssessmentTypes()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

onMounted(() => {
  loadAssessmentTypes()
})
</script>
