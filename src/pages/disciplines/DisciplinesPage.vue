<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">

    <!-- PAGE HEADER BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Disciplines</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestion des notes de conduite</p>
      </div>
    </div>

    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des disciplines"
      searchPlaceholder="Rechercher une discipline..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredDisciplines.length && !loading"
      empty-message="Aucune discipline trouvée"
      :columns="columns"
      @refresh="loadDisciplines"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span>Nouvelle discipline</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="discipline in filteredDisciplines"
          :key="discipline.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ discipline.student?.nom || discipline.studentNom || '-' }}</td>
          <td class="px-6 py-4">{{ discipline.conduite || '-' }}</td>
          <td class="px-6 py-4">{{ discipline.application || '-' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(discipline)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(discipline)"
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
      title="Supprimer la discipline"
      :message="`Êtes-vous sûr de vouloir supprimer cette discipline ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteDiscipline"
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

const disciplines = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const disciplineToDelete = ref(null)

const columns = [
  { key: 'student', label: 'Élève' },
  { key: 'conduite', label: 'Conduite' },
  { key: 'application', label: 'Application' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredDisciplines = computed(() => {
  if (!searchQuery.value) return disciplines.value
  const q = searchQuery.value.toLowerCase()
  return disciplines.value.filter(d =>
    (d.student?.nom && d.student.nom.toLowerCase().includes(q)) ||
    (d.conduite && d.conduite.toLowerCase().includes(q))
  )
})

async function loadDisciplines() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/disciplines')
    disciplines.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/disciplines/form')
}

function openEditForm(discipline) {
  router.push(`/disciplines/form/${discipline.id}`)
}

function confirmDelete(discipline) {
  disciplineToDelete.value = discipline
  showConfirm.value = true
}

async function deleteDiscipline() {
  if (!disciplineToDelete.value) return
  try {
    await api.delete(`/api/disciplines/${disciplineToDelete.value.id}`)
    showConfirm.value = false
    disciplineToDelete.value = null
    await loadDisciplines()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  }
}

onMounted(() => {
  loadDisciplines()
})
</script>
