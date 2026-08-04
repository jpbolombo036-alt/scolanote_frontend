<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- ERROR BANNER -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <DataTableCard
      title="Liste des utilisateurs"
      subtitle="Gestion des utilisateurs et liste des utilisateurs"
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
          class="bg-brand-500 hover:bg-brand-600 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-brand-500/20 transition-all duration-200 flex items-center justify-center gap-2"
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
            <div class="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
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
              <span :class="['w-1.5 h-1.5 rounded-full mr-1.5', user.enabled !== false ? 'bg-brand-500' : 'bg-red-500']"></span>
              {{ user.enabled !== false ? 'Actif' : 'Inactif' }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button
                @click="toggleUserStatus(user)"
                :class="user.enabled !== false
                  ? 'p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition'
                  : 'p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition'"
                :title="user.enabled !== false ? 'Désactiver' : 'Activer'"
              >
                <CheckCircle v-if="user.enabled === false" class="w-4 h-4" />
                <XCircle v-else class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </DataTableCard>

    <ConfirmDialog
      :show="showConfirmDisable"
      :title="userToToggle?.enabled !== false ? 'Désactiver l\'utilisateur' : 'Activer l\'utilisateur'"
      :message="`Êtes-vous sûr de vouloir ${userToToggle?.enabled !== false ? 'désactiver' : 'activer'} '${userToToggle?.username}' ?`"
      :confirmText="userToToggle?.enabled !== false ? 'Désactiver' : 'Activer'"
      @cancel="showConfirmDisable = false"
      @confirm="executeToggle"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import { AlertCircle, UserPlus, CheckCircle, XCircle } from 'lucide-vue-next'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const users = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const columns = [
  { key: 'username', label: 'Nom d\'utilisateur' },
  { key: 'email', label: 'Email' },
  { key: 'roles', label: 'Rôles' },
  { key: 'enabled', label: 'Statut' },
  { key: 'actions', label: 'Actions', headerClass: 'text-right' }
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

const showConfirmDisable = ref(false)
const userToToggle = ref(null)

function toggleUserStatus(user) {
  userToToggle.value = user
  showConfirmDisable.value = true
}

async function executeToggle() {
  if (!userToToggle.value) return
  const user = userToToggle.value
  try {
    if (user.enabled !== false) {
      await api.put(`/api/users/${user.id}`, { enabled: false })
    } else {
      await api.post('/auth/activer-utilisateur', null, { params: { username: user.username } })
    }
    showConfirmDisable.value = false
    userToToggle.value = null
    await loadUsers()
  } catch (e) {
    console.error('Erreur lors de la modification du statut', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  }
}

onBeforeRouteUpdate(async (to, from) => {
  if (to.path === '/users' && from.path.startsWith('/users')) {
    await loadUsers()
  }
})

onMounted(() => {
  loadUsers()
})
</script>
