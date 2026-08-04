<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">


    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des programmes"
      subtitle="Gestion des programmes et liste des programmes"
      searchPlaceholder="Rechercher un programme..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredCurriculums.length && !loading"
      empty-message="Aucun programme trouvé"
      :columns="columns"
      @refresh="loadCurriculums"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-brand-500 hover:bg-brand-600 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-brand-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span class="hidden sm:inline">Nouveau programme</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="curriculum in filteredCurriculums"
          :key="curriculum.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ curriculum.nom }}</td>
          <td class="px-6 py-4">{{ curriculum.levelNom || '-' }}</td>
          <td class="px-6 py-4">{{ curriculum.sectionNom || '-' }}</td>
          <td class="px-6 py-4">{{ curriculum.optionNom || '-' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(curriculum)"
                class="p-2 text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(curriculum)"
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
      title="Supprimer le programme"
      :message="`Êtes-vous sûr de vouloir supprimer le programme '${curriculumToDelete?.nom}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteCurriculum"
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

const curriculums = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const curriculumToDelete = ref(null)

const columns = [
  { key: 'nom', label: 'Nom' },
  { key: 'levelNom', label: 'Niveau' },
  { key: 'sectionNom', label: 'Section' },
  { key: 'optionNom', label: 'Option' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredCurriculums = computed(() => {
  if (!searchQuery.value) return curriculums.value
  const q = searchQuery.value.toLowerCase()
  return curriculums.value.filter(c =>
    (c.nom && c.nom.toLowerCase().includes(q)) ||
    (c.levelNom && c.levelNom.toLowerCase().includes(q)) ||
    (c.sectionNom && c.sectionNom.toLowerCase().includes(q)) ||
    (c.optionNom && c.optionNom.toLowerCase().includes(q))
  )
})

async function loadCurriculums() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/programmes')
    curriculums.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    console.error('Erreur lors du chargement des programmes', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du chargement des programmes'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/programmes/form')
}

function openEditForm(curriculum) {
  router.push(`/programmes/form/${curriculum.id}`)
}

function confirmDelete(curriculum) {
  curriculumToDelete.value = curriculum
  showConfirm.value = true
}

async function deleteCurriculum() {
  if (!curriculumToDelete.value) return
  try {
    await api.delete(`/api/programmes/${curriculumToDelete.value.id}`)
    showConfirm.value = false
    curriculumToDelete.value = null
    await loadCurriculums()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

onMounted(() => {
  loadCurriculums()
})
</script>