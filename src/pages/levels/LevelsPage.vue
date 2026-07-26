<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">


    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des niveaux"
      subtitle="Gestion des niveaux et liste des niveaux"
      searchPlaceholder="Rechercher un niveau..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredLevels.length && !loading"
      empty-message="Aucun niveau trouvé"
      :columns="columns"
      @refresh="loadLevels"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span class="hidden sm:inline">Nouveau niveau</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="level in filteredLevels"
          :key="level.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ level.nom }}</td>
          <td class="px-6 py-4">{{ level.ordre ?? '-' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(level)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(level)"
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
      title="Supprimer le niveau"
      :message="`Êtes-vous sûr de vouloir supprimer le niveau '${levelToDelete?.nom}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteLevel"
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

const levels = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const levelToDelete = ref(null)

const columns = [
  { key: 'nom', label: 'Nom' },
  { key: 'ordre', label: 'Ordre' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredLevels = computed(() => {
  if (!searchQuery.value) return levels.value
  const q = searchQuery.value.toLowerCase()
  return levels.value.filter(l =>
    (l.nom && l.nom.toLowerCase().includes(q))
  )
})

async function loadLevels() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/niveaux')
    levels.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    console.error('Erreur lors du chargement des niveaux', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du chargement des niveaux'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/niveaux/form')
}

function openEditForm(level) {
  router.push(`/niveaux/form/${level.id}`)
}

function confirmDelete(level) {
  levelToDelete.value = level
  showConfirm.value = true
}

async function deleteLevel() {
  if (!levelToDelete.value) return
  try {
    await api.delete(`/api/niveaux/${levelToDelete.value.id}`)
    showConfirm.value = false
    levelToDelete.value = null
    await loadLevels()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

onMounted(() => {
  loadLevels()
})
</script>