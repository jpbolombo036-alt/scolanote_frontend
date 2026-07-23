<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- PAGE HEADER BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Écoles</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestion des établissements scolaires</p>
      </div>

      <button
        @click="openCreateForm"
        class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Plus class="w-4 h-4" />
        <span>Nouvelle école</span>
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
            placeholder="Rechercher une école..."
            class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-emerald-500 transition"
          />
        </div>

        <button
          @click="loadSchools"
          class="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition"
          title="Actualiser la liste"
        >
          <RefreshCw :class="['w-4 h-4', { 'animate-spin': loading }]" />
        </button>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
        <p class="text-xs text-slate-400 font-medium mt-3">Chargement des écoles...</p>
      </div>

      <!-- Table Content -->
      <div v-else-if="filteredSchools.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th class="px-6 py-4">Nom de l'école</th>
              <th class="px-6 py-4">Code</th>
              <th class="px-6 py-4">Province</th>
              <th class="px-6 py-4">Commune / Territoire</th>
              <th class="px-6 py-4">Email</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <tr
              v-for="school in filteredSchools"
              :key="school.id"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
            >
              <td class="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
                  {{ (school.nom || 'E').substring(0, 2).toUpperCase() }}
                </div>
                <span>{{ school.nom }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  {{ school.code || '-' }}
                </span>
              </td>
              <td class="px-6 py-4">{{ school.province || '-' }}</td>
              <td class="px-6 py-4">{{ school.communeTerritoire || '-' }}</td>
              <td class="px-6 py-4 text-slate-500 dark:text-slate-400">{{ school.email || '-' }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="openEditForm(school)"
                    class="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                    title="Modifier"
                  >
                    <Edit3 class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmDelete(school)"
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
      <EmptyState v-else message="Aucune école trouvée" />

      <!-- Pagination -->
      <Pagination
        :page="pagination.page"
        :size="pagination.size"
        :totalElements="pagination.totalElements"
        :totalPages="pagination.totalPages"
        @prev="onPageChange(pagination.page - 1)"
        @next="onPageChange(pagination.page + 1)"
        @goTo="onPageChange"
      />
    </div>

    <!-- SCHOOL FORM MODAL -->
    <SchoolForm
      v-if="showForm"
      :school="editingSchool"
      @save="saveSchool"
      @close="showForm = false"
    />

    <!-- CONFIRM DELETE DIALOG -->
    <ConfirmDialog
      :show="showConfirm"
      title="Supprimer l'école"
      :message="`Êtes-vous sûr de vouloir supprimer '${schoolToDelete?.nom}' ?`"
      confirmText="Supprimer"
      @cancel="showConfirm = false"
      @confirm="deleteSchool"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import SchoolForm from './SchoolForm.vue'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { Plus, Search, RefreshCw, AlertCircle, Edit3, Trash2 } from 'lucide-vue-next'

const schools = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingSchool = ref(null)
const searchQuery = ref('')

const showConfirm = ref(false)
const schoolToDelete = ref(null)

const pagination = ref({
  page: 0,
  size: 10,
  totalPages: 1,
  totalElements: 0
})

const filteredSchools = computed(() => {
  if (!searchQuery.value) return schools.value
  const q = searchQuery.value.toLowerCase()
  return schools.value.filter(s =>
    (s.nom && s.nom.toLowerCase().includes(q)) ||
    (s.code && s.code.toLowerCase().includes(q)) ||
    (s.province && s.province.toLowerCase().includes(q))
  )
})

async function loadSchools() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/ecoles', {
      params: {
        page: pagination.value.page,
        size: pagination.value.size
      }
    })
    
    if (response.data.content) {
      schools.value = response.data.content
      pagination.value.totalPages = response.data.totalPages || 1
      pagination.value.totalElements = response.data.totalElements || schools.value.length
    } else if (Array.isArray(response.data)) {
      schools.value = response.data
      pagination.value.totalPages = 1
      pagination.value.totalElements = response.data.length
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement des écoles'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  editingSchool.value = null
  showForm.value = true
}

function openEditForm(school) {
  editingSchool.value = school
  showForm.value = true
}

async function saveSchool(schoolData) {
  try {
    if (editingSchool.value) {
      await api.put(`/api/ecoles/${editingSchool.value.id}`, schoolData)
    } else {
      await api.post('/api/ecoles', schoolData)
    }
    showForm.value = false
    await loadSchools()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur lors de la sauvegarde')
  }
}

function confirmDelete(school) {
  schoolToDelete.value = school
  showConfirm.value = true
}

async function deleteSchool() {
  if (!schoolToDelete.value) return
  try {
    await api.delete(`/api/ecoles/${schoolToDelete.value.id}`)
    showConfirm.value = false
    schoolToDelete.value = null
    await loadSchools()
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur lors de la suppression')
  }
}

function onPageChange(page) {
  if (page < 0 || page >= pagination.value.totalPages) return
  pagination.value.page = page
  loadSchools()
}

onMounted(() => {
  loadSchools()
})
</script>
