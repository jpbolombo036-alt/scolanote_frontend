<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">



    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des inscriptions"
      searchPlaceholder="Rechercher une inscription..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredEnrollments.length && !loading"
      empty-message="Aucune inscription trouvée"
      :columns="columns"
      @refresh="loadEnrollments"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <UserPlus class="w-4 h-4" />
          <span class="hidden sm:inline">Nouvelle inscription</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="enrollment in filteredEnrollments"
          :key="enrollment.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">
            {{ enrollment.student?.nom || enrollment.studentId || '-' }}
          </td>
          <td class="px-6 py-4">{{ enrollment.classroom?.nom || enrollment.classroomId || '-' }}</td>
          <td class="px-6 py-4">{{ enrollment.dateInscription || '-' }}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(enrollment)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(enrollment)"
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
      title="Supprimer l'inscription"
      :message="`Êtes-vous sûr de vouloir supprimer cette inscription ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteEnrollment"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { UserPlus, Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const enrollments = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const enrollmentToDelete = ref(null)

const columns = [
  { key: 'student', label: 'Élève' },
  { key: 'classroom', label: 'Classe' },
  { key: 'dateInscription', label: 'Date inscription' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredEnrollments = computed(() => {
  if (!searchQuery.value) return enrollments.value
  const q = searchQuery.value.toLowerCase()
  return enrollments.value.filter(e =>
    (e.student?.nom && e.student.nom.toLowerCase().includes(q)) ||
    (e.classroom?.nom && e.classroom.nom.toLowerCase().includes(q))
  )
})

async function loadEnrollments() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/inscriptions')
    enrollments.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/inscriptions/form')
}

function openEditForm(enrollment) {
  router.push(`/inscriptions/form/${enrollment.id}`)
}

function confirmDelete(enrollment) {
  enrollmentToDelete.value = enrollment
  showConfirm.value = true
}

async function deleteEnrollment() {
  if (!enrollmentToDelete.value) return
  try {
    await api.delete(`/api/inscriptions/${enrollmentToDelete.value.id}`)
    showConfirm.value = false
    enrollmentToDelete.value = null
    await loadEnrollments()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  }
}

onMounted(() => {
  loadEnrollments()
})
</script>
