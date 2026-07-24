<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- PAGE HEADER BAR -->
    <div class="hidden lg:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Notes</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestion des notes et évaluations</p>
      </div>

      <button
        @click="openCreateForm"
        class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Plus class="w-4 h-4" />
        <span>Nouvelle note</span>
      </button>
    </div>

    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- Desktop Table -->
    <div class="hidden lg:block bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
      <!-- Table Header Bar / Search -->
      <div class="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative w-full sm:w-72">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une note..."
            class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-emerald-500 transition"
          />
        </div>

        <button
          @click="loadGrades"
          class="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition"
          title="Actualiser"
        >
          <RefreshCw :class="['w-4 h-4', { 'animate-spin': loading }]" />
        </button>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
        <p class="text-xs text-slate-400 font-medium mt-3">Chargement des notes...</p>
      </div>

      <!-- Table Content -->
      <div v-else-if="filteredGrades.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th class="px-6 py-4">Élève</th>
              <th class="px-6 py-4">Évaluation</th>
              <th class="px-6 py-4">Note</th>
              <th class="px-6 py-4">Absence</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <tr
              v-for="grade in filteredGrades"
              :key="grade.id"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
            >
              <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ grade.studentNom || '-' }}</td>
              <td class="px-6 py-4">{{ grade.assessment?.titre || grade.assessmentId || '-' }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/20">
                  {{ grade.note || '-' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="grade.absence ? 'text-red-600' : 'text-emerald-600'">
                  {{ grade.absence ? 'Oui' : 'Non' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="openEditForm(grade)"
                    class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                    title="Modifier"
                  >
                    <Edit3 class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmDelete(grade)"
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
      <EmptyState v-else message="Aucune note trouvée" />
    </div>

    <!-- Mobile Cards -->
    <div class="lg:hidden space-y-3">
      <!-- Search & Add Button -->
      <div class="flex gap-2">
        <div class="relative flex-1">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une note..."
            class="w-full bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium pl-10 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 transition"
          />
        </div>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center"
        >
          <Plus class="w-5 h-5" />
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
        <p class="text-xs text-slate-400 font-medium mt-3">Chargement...</p>
      </div>

      <!-- Cards -->
      <div v-else-if="filteredGrades.length > 0" class="space-y-3">
        <div
          v-for="grade in filteredGrades"
          :key="grade.id"
          class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-xs">
                {{ (grade.studentNom || '?').substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900 dark:text-white">{{ grade.studentNom || '-' }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ grade.assessment?.titre || grade.assessmentId || '-' }}</p>
              </div>
            </div>
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-xs border border-emerald-500/20">
              {{ grade.note || '-' }}/20
            </span>
          </div>
          <div class="flex items-center justify-between text-xs mb-3">
            <span :class="grade.absence ? 'text-red-600' : 'text-emerald-600' font-medium">
              {{ grade.absence ? 'Absent' : 'Présent' }}
            </span>
          </div>
          <div class="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              @click="openEditForm(grade)"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 transition"
            >
              <Edit3 class="w-3.5 h-3.5" />
              Modifier
            </button>
            <button
              @click="confirmDelete(grade)"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition"
            >
              <Trash2 class="w-3.5 h-3.5" />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State Mobile -->
      <EmptyState v-else message="Aucune note trouvée" />
    </div>

    <!-- GRADE FORM MODAL -->
    <GradeForm
      v-if="showForm"
      :grade="editingGrade"
      @save="saveGrade"
      @close="showForm = false"
    />

    <!-- CONFIRM DELETE DIALOG -->
    <ConfirmDialog
      :show="showConfirm"
      title="Supprimer la note"
      :message="`Êtes-vous sûr de vouloir supprimer cette note ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteGrade"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import GradeForm from './GradeForm.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { Plus, Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import GradeForm from './GradeForm.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { Plus, Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'

const grades = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingGrade = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const gradeToDelete = ref(null)

const filteredGrades = computed(() => {
  if (!searchQuery.value) return grades.value
  const q = searchQuery.value.toLowerCase()
  return grades.value.filter(g =>
    (g.studentNom && g.studentNom.toLowerCase().includes(q))
  )
})

async function loadGrades() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/notes')
    grades.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  editingGrade.value = null
  showForm.value = true
}

function openEditForm(grade) {
  editingGrade.value = grade
  showForm.value = true
}

async function saveGrade(data) {
  try {
    if (editingGrade.value) {
      await api.put(`/api/notes/${editingGrade.value.id}`, data)
    } else {
      await api.post('/api/notes', data)
    }
    showForm.value = false
    await loadGrades()
  } catch (e) {
    console.error('Erreur lors de la sauvegarde', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  }
}

function confirmDelete(grade) {
  gradeToDelete.value = grade
  showConfirm.value = true
}

async function deleteGrade() {
  if (!gradeToDelete.value) return
  try {
    await api.delete(`/api/notes/${gradeToDelete.value.id}`)
    showConfirm.value = false
    gradeToDelete.value = null
    await loadGrades()
  } catch (e) {
    console.error('Erreur lors de la suppression', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  }
}

onMounted(() => {
  loadGrades()
})
</script>
