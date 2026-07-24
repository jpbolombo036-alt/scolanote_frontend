<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">



    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- Mobile Header + Search -->
    <div class="lg:hidden flex gap-2">
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un utilisateur..."
          class="w-full bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium pl-10 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 transition"
        />
      </div>
      <button
        @click="openCreateForm"
        class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center"
      >
        <UserPlus class="w-5 h-5" />
      </button>
    </div>

    <!-- Desktop Table -->
    <div class="hidden lg:block">
      <DataTableCard
        title="Liste des utilisateurs"
        searchPlaceholder="Rechercher un utilisateur..."
        v-model:search="searchQuery"
        :loading="loading"
        :empty="!filteredUsers.length && !loading"
        empty-message="Aucun utilisateur trouvé"
        :columns="columns"
        @refresh="loadUsers"
      >
        <template #actions>
          <button
            @click="openCreateForm"
            class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <UserPlus class="w-4 h-4" />
            <span>Nouvel utilisateur</span>
          </button>
        </template>

        <template #default>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
          >
            <td class="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                {{ (user.username || 'U').substring(0, 2).toUpperCase() }}
              </div>
              <span>{{ user.username }}</span>
            </td>
            <td class="px-6 py-4 text-slate-500 dark:text-slate-400">{{ user.email || '-' }}</td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="role in (user.roles || ['USER'])"
                  :key="role"
                  class="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold text-[10px] border border-purple-500/20"
                >
                  {{ role }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="[
                'px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center',
                user.enabled !== false
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
              ]">
                <span :class="['w-1.5 h-1.5 rounded-full mr-1.5', user.enabled !== false ? 'bg-emerald-500' : 'bg-red-500']"></span>
                {{ user.enabled !== false ? 'Actif' : 'Inactif' }}
              </span>
            </td>
          </tr>
        </template>
      </DataTableCard>
    </div>

    <!-- Mobile Cards -->
    <div class="lg:hidden space-y-3">
      <!-- Loading -->
      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
        <p class="text-xs text-slate-400 font-medium mt-3">Chargement...</p>
      </div>

      <!-- Cards -->
      <div v-else-if="filteredUsers.length > 0" class="space-y-3">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                {{ (user.username || 'U').substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900 dark:text-white">{{ user.username }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ user.email || 'N/A' }}</p>
              </div>
            </div>
            <span :class="[
              'px-2 py-0.5 rounded-md text-[10px] font-bold',
              user.enabled !== false
                ? 'bg-emerald-500/10 text-emerald-600'
                : 'bg-red-500/10 text-red-600'
            ]">
              {{ user.enabled !== false ? 'Actif' : 'Inactif' }}
            </span>
          </div>
          <div class="flex flex-wrap gap-1 mb-3">
            <span
              v-for="role in (user.roles || ['USER'])"
              :key="role"
              class="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 font-semibold text-[10px] border border-purple-500/20"
            >
              {{ role }}
            </span>
          </div>
          <div class="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              @click="openCreateForm"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 transition"
            >
              <Edit3 class="w-3.5 h-3.5" />
              Modifier
            </button>
            <button
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition"
            >
              <Trash2 class="w-3.5 h-3.5" />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State Mobile -->
      <EmptyState v-else message="Aucun utilisateur trouvé" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { Search, RefreshCw, UserPlus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const users = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const columns = [
  { key: 'username', label: 'Nom d\'utilisateur' },
  { key: 'email', label: 'Email' },
  { key: 'roles', label: 'Rôles' },
  { key: 'enabled', label: 'Statut' }
]

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u =>
    (u.username && u.username.toLowerCase().includes(q)) ||
    (u.email && u.email.toLowerCase().includes(q))
  )
})

async function loadUsers() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/users')
    users.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    console.error('Erreur lors du chargement des utilisateurs', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du chargement des utilisateurs'
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/users/nouveau')
}

onMounted(() => {
  loadUsers()
})
</script>
