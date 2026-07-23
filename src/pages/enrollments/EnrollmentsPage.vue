<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- PAGE HEADER BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Inscriptions</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestion des inscriptions élèves</p>
      </div>

      <button
        @click="openCreateForm"
        class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <UserPlus class="w-4 h-4" />
        <span>Nouvelle inscription</span>
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
            placeholder="Rechercher une inscription..."
            class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-emerald-500 transition"
          />
        </div>

        <button
          @click="loadEnrollments"
          class="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition"
          title="Actualiser"
        >
          <RefreshCw :class="['w-4 h-4', { 'animate-spin': loading }]" />
        </button>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
        <p class="text-xs text-slate-400 font-medium mt-3">Chargement des inscriptions...</p>
      </div>

      <!-- Table Content -->
      <div v-else-if="filteredEnrollments.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th class="px-6 py-4">Élève</th>
              <th class="px-6 py-4">Classe</th>
              <th class="px-6 py-4">Date inscription</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">
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
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <EmptyState v-else message="Aucune inscription trouvée" />

    </div>

    <!-- ENROLLMENT FORM MODAL -->
    <EnrollmentForm
      v-if="showForm"
      :enrollment="editingEnrollment"
      @save="saveEnrollment"
      @close="showForm = false"
    />

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
import EnrollmentForm from './EnrollmentForm.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { UserPlus, Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'

    const enrollments = ref([])
    const loading = ref(false)
    const error = ref(null)
    const showForm = ref(false)
    const editingEnrollment = ref(null)
    const searchQuery = ref('')

    const showConfirm = ref(false)
    const enrollmentToDelete = ref(null)

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
      editingEnrollment.value = null
      showForm.value = true
    }

    function openEditForm(enrollment) {
      editingEnrollment.value = enrollment
      showForm.value = true
    }

    async function saveEnrollment(data) {
      try {
        if (editingEnrollment.value) {
          await api.put(`/api/inscriptions/${editingEnrollment.value.id}`, data)
        } else {
          await api.post('/api/inscriptions', data)
        }
        showForm.value = false
        await loadEnrollments()
      } catch (e) {
        alert(e.response?.data?.message || 'Erreur')
      }
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
        alert(e.response?.data?.message || 'Erreur')
      }
    }

    onMounted(() => {
      loadEnrollments()
    })
</script>
