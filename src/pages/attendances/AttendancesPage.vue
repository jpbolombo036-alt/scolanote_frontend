<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- PAGE HEADER BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Présences</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Suivi des présences, retards et absences</p>
      </div>

      <button
        @click="openCreateForm"
        class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Plus class="w-4 h-4" />
        <span>Nouvelle présence</span>
      </button>
    </div>

    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- DATA TABLE CONTAINER -->
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-xl overflow-hidden transition-colors duration-200">
      
      <!-- Table Header Bar / Search -->
      <div class="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative w-full sm:w-72">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une présence..."
            class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-emerald-500 transition"
          />
        </div>

        <button
          @click="loadAttendances"
          class="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition"
          title="Actualiser"
        >
          <RefreshCw :class="['w-4 h-4', { 'animate-spin': loading }]" />
        </button>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
        <p class="text-xs text-slate-400 font-medium mt-3">Chargement des présences...</p>
      </div>

      <!-- Table Content -->
      <div v-else-if="filteredAttendances.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th class="px-6 py-4">Élève</th>
              <th class="px-6 py-4">Date</th>
              <th class="px-6 py-4">Retard</th>
              <th class="px-6 py-4">Absence</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">
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
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <EmptyState v-else message="Aucune présence enregistrée" />

    </div>

    <!-- ATTENDANCE FORM MODAL -->
    <AttendanceForm
      v-if="showForm"
      :attendance="editingAttendance"
      @save="saveAttendance"
      @close="showForm = false"
    />

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
import AttendanceForm from './AttendanceForm.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'

    const attendances = ref([])
    const loading = ref(false)
    const error = ref(null)
    const showForm = ref(false)
    const editingAttendance = ref(null)
    const searchQuery = ref('')

    const showConfirm = ref(false)
    const attendanceToDelete = ref(null)

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
      editingAttendance.value = null
      showForm.value = true
    }

    function openEditForm(attendance) {
      editingAttendance.value = attendance
      showForm.value = true
    }

    async function saveAttendance(data) {
      try {
        if (editingAttendance.value) {
          await api.put(`/api/presences/${editingAttendance.value.id}`, data)
        } else {
          await api.post('/api/presences', data)
        }
        showForm.value = false
        await loadAttendances()
      } catch (e) {
        alert(e.response?.data?.message || 'Erreur lors de la sauvegarde')
      }
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
        alert(e.response?.data?.message || 'Erreur lors de la suppression')
      }
    }

    onMounted(() => {
      loadAttendances()
    })
</script>
