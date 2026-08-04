<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div v-if="error" class="border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600 dark:text-red-400">
      {{ error }}
    </div>



    <!-- DATA TABLE CARD -->
    <DataTableCard
      title="Liste des rôles"
      subtitle="Gestion des rôles et liste des rôles"
      searchPlaceholder="Rechercher un rôle..."
      v-model:search="searchQuery"
      :loading="loading"
      :empty="!filteredRoles.length && !loading"
      empty-message="Aucun rôle trouvé"
      :columns="columns"
      @refresh="loadRoles"
    >
      <template #actions>
        <!-- Création de rôles non disponible pour le moment -->
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
            <span class="px-3 py-1 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-[11px] border border-brand-500/20">
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

const roles = ref([])
const loading = ref(false)
const error = ref<string | null>(null)
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
  error.value = null
  try {
    const response = await api.get('/api/roles')
    roles.value = Array.isArray(response.data) ? response.data : (response.data.content || [])
  } catch (e) {
    console.error('Erreur lors du chargement des rôles', e)
    error.value = 'Impossible de charger les roles. Reessayez.'
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  loadRoles()
})
</script>
