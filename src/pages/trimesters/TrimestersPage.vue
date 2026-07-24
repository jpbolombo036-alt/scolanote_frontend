<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- PAGE HEADER BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Trimestres</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestion des trimestres académiques</p>
      </div>
    </div>

    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des trimestres"
      searchPlaceholder="Rechercher un trimestre..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredTrimesters.length && !loading"
      empty-message="Aucun trimestre trouvé"
      :columns="columns"
      @refresh="loadTrimesters"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span>Nouveau trimestre</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="trimester in filteredTrimesters"
          :key="trimester.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ trimester.nom }}</td>
          <td class="px-6 py-4">{{ trimester.academicYear?.libelle || trimester.academicYearLibelle || '-' }}</td>
          <td class="px-6 py-4">{{ trimester.ordre || '-' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(trimester)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(trimester)"
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
      title="Supprimer le trimestre"
      :message="`Êtes-vous sûr de vouloir supprimer '${trimesterToDelete?.nom}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteTrimester"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { Plus, Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const trimesters = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const trimesterToDelete = ref(null)

const columns = [
  { key: 'nom', label: 'Nom' },
  { key: 'academicYear', label: 'Année scolaire' },
  { key: 'ordre', label: 'Ordre' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredTrimesters = computed(() => {
  if (!searchQuery.value) return trimesters.value
  const q = searchQuery.value.toLowerCase()
  return trimesters.value.filter(t =>
    (t.nom && t.nom.toLowerCase().includes(q))
  )
})

async function loadTrimesters() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/trimestres')
    trimesters.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/trimestres/form')
}

function openEditForm(trimester) {
  router.push(`/trimestres/form/${trimester.id}`)
}

function confirmDelete(trimester) {
  trimesterToDelete.value = trimester
  showConfirm.value = true
}

async function deleteTrimester() {
  if (!trimesterToDelete.value) return
  try {
    await api.delete(`/api/trimestres/${trimesterToDelete.value.id}`)
    showConfirm.value = false
    trimesterToDelete.value = null
    await loadTrimesters()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  }
}

onMounted(() => {
  loadTrimesters()
})
</script>
