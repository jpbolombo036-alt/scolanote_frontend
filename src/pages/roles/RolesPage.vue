<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">

    <!-- PAGE HEADER BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Rôles & Permissions</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Niveaux d'accès et rôles du système</p>
      </div>
    </div>

    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des rôles"
      subtitle="Consultez et gérez vos rôles"
      searchPlaceholder="Rechercher un rôle..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredRoles.length && !loading"
      empty-message="Aucun rôle trouvé"
      :columns="columns"
      @refresh="loadRoles"
    >
      <template #actions>
        <button
          @click="openCreateForm"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span>Nouveau rôle</span>
        </button>
      </template>

      <template #default>
        <tr
          v-for="role in filteredRoles"
          :key="role.id"
          class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
        >
          <td class="px-6 py-4 font-mono font-semibold text-slate-400">#{{ role.id }}</td>
          <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ role.nom || role.name || '-' }}</td>
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/20">
              {{ role.nom || role.name || 'ROLE' }}
            </span>
          </td>
        </tr>
      </template>
    </DataTableCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import DataTableCard from '@/components/common/DataTableCard.vue'
import { Plus, Search, RefreshCw } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const roles = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nom', label: 'Nom du Rôle' },
  { key: 'badge', label: 'Badge' }
]

const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value
  const q = searchQuery.value.toLowerCase()
  return roles.value.filter(r => (r.nom || r.name || '').toLowerCase().includes(q))
})

async function loadRoles() {
  loading.value = true
  try {
    const response = await api.get('/api/roles')
    roles.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    console.error('Erreur lors du chargement des rôles', e)
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  router.push('/roles/form')
}

onMounted(() => {
  loadRoles()
})
</script>
