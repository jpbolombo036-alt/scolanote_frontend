<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-xl font-semibold mb-4">Sauvegardes</h1>
    <div class="mb-4">
      <button @click="create" class="btn">Créer une sauvegarde</button>
    </div>
    <div v-if="backups.length === 0" class="text-sm text-gray-500">Aucune sauvegarde.</div>
    <ul>
      <li v-for="b in backups" :key="b.id" class="py-3 px-4 mb-2 border border-slate-200 rounded-lg">
        <div class="text-sm font-semibold">{{ b.id }}</div>
        <div class="text-xs text-slate-500">{{ b.status }}<span v-if="b.createdAt"> — {{ b.createdAt }}</span></div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createBackup, listBackups } from '@/api/admin'

const backups = ref<Array<any>>([])

onMounted(async () => {
  try { backups.value = await listBackups() } catch (e) { console.error(e) }
})

async function create() {
  try {
    const res = await createBackup()
    backups.value.unshift(res)
  } catch (e) { console.error(e) }
}
</script>

<style scoped>
.btn { @apply px-3 py-1 bg-sky-600 text-white rounded }
</style>
