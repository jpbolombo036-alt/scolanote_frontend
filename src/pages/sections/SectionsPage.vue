<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">


    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des sections"
      subtitle="Gestion des sections et liste des sections"
      searchPlaceholder="Rechercher une section..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredSections.length && !loading"
      empty-message="Aucune section trouvée"
      :columns="columns"
      @refresh="loadSections"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-brand-500 hover:bg-brand-600 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-brand-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span class="hidden sm:inline">Nouvelle section</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="section in filteredSections"
          :key="section.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ section.nom }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(section)"
                class="p-2 text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(section)"
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
      title="Supprimer la section"
      :message="`Êtes-vous sûr de vouloir supprimer la section '${sectionToDelete?.nom}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteSection"
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

const sections = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const sectionToDelete = ref(null)

const columns = [
  { key: 'nom', label: 'Nom' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredSections = computed(() => {
  if (!searchQuery.value) return sections.value
  const q = searchQuery.value.toLowerCase()
  return sections.value.filter(s =>
    (s.nom && s.nom.toLowerCase().includes(q))
  )
})

async function loadSections() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/sections')
    sections.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    console.error('Erreur lors du chargement des sections', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du chargement des sections'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/sections/form')
}

function openEditForm(section) {
  router.push(`/sections/form/${section.id}`)
}

function confirmDelete(section) {
  sectionToDelete.value = section
  showConfirm.value = true
}

async function deleteSection() {
  if (!sectionToDelete.value) return
  try {
    await api.delete(`/api/sections/${sectionToDelete.value.id}`)
    showConfirm.value = false
    sectionToDelete.value = null
    await loadSections()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

onMounted(() => {
  loadSections()
})
</script>