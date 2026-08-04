<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">


    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des matières de programme"
      subtitle="Gestion des matières de programme et liste des matières"
      searchPlaceholder="Rechercher une matière de programme..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredSubjects.length && !loading"
      empty-message="Aucune matière de programme trouvée"
      :columns="columns"
      @refresh="loadCurriculumSubjects"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-brand-500 hover:bg-brand-600 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-brand-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span class="hidden sm:inline">Nouvelle matière</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="cs in filteredSubjects"
          :key="cs.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ cs.curriculumNom || '-' }}</td>
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ cs.subjectNom || '-' }}</td>
          <td class="px-6 py-4">{{ cs.coefficient ?? '-' }}</td>
          <td class="px-6 py-4">{{ cs.ordre ?? '-' }}</td>
          <td class="px-6 py-4">
            <span :class="cs.obligatoire ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'">
              {{ cs.obligatoire ? 'Oui' : 'Non' }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(cs)"
                class="p-2 text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(cs)"
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
      title="Supprimer la matière de programme"
      :message="`Êtes-vous sûr de vouloir supprimer la matière '${subjectToDelete?.subjectNom}' du programme '${subjectToDelete?.curriculumNom}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteCurriculumSubject"
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

const curriculumSubjects = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const subjectToDelete = ref(null)

const columns = [
  { key: 'curriculumNom', label: 'Programme' },
  { key: 'subjectNom', label: 'Matière' },
  { key: 'coefficient', label: 'Coefficient' },
  { key: 'ordre', label: 'Ordre' },
  { key: 'obligatoire', label: 'Obligatoire' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredSubjects = computed(() => {
  if (!searchQuery.value) return curriculumSubjects.value
  const q = searchQuery.value.toLowerCase()
  return curriculumSubjects.value.filter(cs =>
    (cs.curriculumNom && cs.curriculumNom.toLowerCase().includes(q)) ||
    (cs.subjectNom && cs.subjectNom.toLowerCase().includes(q))
  )
})

async function loadCurriculumSubjects() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/matieres-programme')
    curriculumSubjects.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    console.error('Erreur lors du chargement des matières de programme', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du chargement des matières de programme'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/matieres-programme/form')
}

function openEditForm(cs) {
  router.push(`/matieres-programme/form/${cs.id}`)
}

function confirmDelete(cs) {
  subjectToDelete.value = cs
  showConfirm.value = true
}

async function deleteCurriculumSubject() {
  if (!subjectToDelete.value) return
  try {
    await api.delete(`/api/matieres-programme/${subjectToDelete.value.id}`)
    showConfirm.value = false
    subjectToDelete.value = null
    await loadCurriculumSubjects()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

onMounted(() => {
  loadCurriculumSubjects()
})
</script>