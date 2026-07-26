<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des élèves"
      subtitle="Gestion des élèves et liste des élèves"
      searchPlaceholder="Rechercher un élève..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredStudents.length && !loading"
      empty-message="Aucun élève trouvé"
      :columns="columns"
      @refresh="loadStudents"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <UserPlus class="w-4 h-4" />
          <span class="hidden sm:inline">Nouvel élève</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="student in filteredStudents"
          :key="student.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
              {{ student.matricule || '-' }}
            </span>
          </td>
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
              {{ (student.nom || 'E').substring(0, 1).toUpperCase() }}
            </div>
            <div>
              <span>{{ student.nom }} {{ student.postnom || '' }} {{ student.prenom || '' }}</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <span :class="[
              'px-2 py-0.5 rounded-full text-[10px] font-bold',
              student.sexe === 'M'
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                : 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20'
            ]">
              {{ student.sexe === 'M' ? 'Masculin' : (student.sexe === 'F' ? 'Féminin' : '-') }}
            </span>
          </td>
          <td class="px-6 py-4 text-slate-500 dark:text-slate-400">{{ student.dateNaissance || '-' }}</td>
          <td class="px-6 py-4 text-slate-500 dark:text-slate-400">{{ student.telephoneParent || '-' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(student)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(student)"
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
      title="Supprimer l'élève"
      :message="`Êtes-vous sûr de vouloir supprimer l'élève '${studentToDelete?.nom}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteStudent"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useRouter, useRoute } from 'vue-router'
import { UserPlus, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const students = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const studentToDelete = ref(null)

const currentPage = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)

const columns = [
  { key: 'matricule', label: 'Matricule' },
  { key: 'nom', label: 'Élève' },
  { key: 'sexe', label: 'Sexe' },
  { key: 'dateNaissance', label: 'Date de naissance' },
  { key: 'telephoneParent', label: 'Téléphone parent' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value
  const q = searchQuery.value.toLowerCase()
  return students.value.filter(s =>
    (s.nom && s.nom.toLowerCase().includes(q)) ||
    (s.postnom && s.postnom.toLowerCase().includes(q)) ||
    (s.matricule && s.matricule.toLowerCase().includes(q))
  )
})

async function loadStudents() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/eleves', {
      params: {
        page: currentPage.value,
        size: pageSize.value,
        sort: 'id,desc'
      }
    })
    const data = response.data
    if (data.content) {
      students.value = data.content
      totalPages.value = data.totalPages
      totalElements.value = data.totalElements
    } else {
      students.value = Array.isArray(data) ? data : (data.content || [])
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement des élèves'
  } finally {
    loading.value = false
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    loadStudents()
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    loadStudents()
  }
}

watch(searchQuery, () => {
  currentPage.value = 0
  loadStudents()
})

function openCreateForm() {
  router.push('/eleves/form')
}

function openEditForm(student) {
  router.push(`/eleves/form/${student.id}`)
}

function confirmDelete(student) {
  studentToDelete.value = student
  showConfirm.value = true
}

async function deleteStudent() {
  if (!studentToDelete.value) return
  try {
    await api.delete(`/api/eleves/${studentToDelete.value.id}`)
    showConfirm.value = false
    studentToDelete.value = null
    await loadStudents()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

onBeforeRouteUpdate(async (to, from) => {
  if (to.path === '/eleves' && from.path.startsWith('/eleves/form')) {
    await loadStudents()
  }
})

onMounted(() => {
  loadStudents()
})
</script>
