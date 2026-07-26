<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">



    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des présences"
      subtitle="Gestion des présences et liste des présences"
      searchPlaceholder="Rechercher une présence..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredAttendances.length && !loading"
      empty-message="Aucune présence enregistrée"
      :columns="columns"
      @refresh="loadAttendances"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span>Nouvelle présence</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="attendance in filteredAttendances"
          :key="attendance.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ attendance.studentNom || '-' }}</td>
          <td class="px-6 py-4">{{ attendance.date || '-' }}</td>
          <td class="px-6 py-4">
            <span :class="attendance.retard ? 'text-amber-600' : 'text-emerald-600'">
              {{ attendance.retard ? 'Oui' : 'Non' }}
            </span>
          </td>
          <td class="px-6 py-4">
            <span :class="attendance.absence ? 'text-red-600' : 'text-emerald-600'">
              {{ attendance.absence ? 'Oui' : 'Non' }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="openEditForm(attendance)"
                class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                title="Modifier"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(attendance)"
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
      title="Supprimer la présence"
      :message="`Êtes-vous sûr de vouloir supprimer cette présence ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteAttendance"
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

const attendances = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const attendanceToDelete = ref(null)

const columns = [
  { key: 'student', label: 'Élève' },
  { key: 'date', label: 'Date' },
  { key: 'retard', label: 'Retard' },
  { key: 'absence', label: 'Absence' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
]

const filteredAttendances = computed(() => {
  if (!searchQuery.value) return attendances.value
  const q = searchQuery.value.toLowerCase()
  return attendances.value.filter(a =>
    (a.studentNom && a.studentNom.toLowerCase().includes(q)) ||
    (a.date && a.date.toLowerCase().includes(q))
  )
})

async function loadAttendances() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/presences')
    attendances.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement des présences'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/presences/form')
}

function openEditForm(attendance) {
  router.push(`/presences/form/${attendance.id}`)
}

function confirmDelete(attendance) {
  attendanceToDelete.value = attendance
  showConfirm.value = true
}

async function deleteAttendance() {
  if (!attendanceToDelete.value) return
  try {
    await api.delete(`/api/presences/${attendanceToDelete.value.id}`)
    showConfirm.value = false
    attendanceToDelete.value = null
    await loadAttendances()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la suppression'
  }
}

onMounted(() => {
  loadAttendances()
})
</script>
