<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-xl font-semibold mb-4">Exports</h1>
    <div v-if="message" class="mb-4 text-sm text-gray-600">{{ message }}</div>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr] mb-4 items-end">
      <label class="space-y-2">
        <div class="text-sm font-medium">Type d'export</div>
        <select v-model="exportType" class="w-full rounded border border-slate-300 px-3 py-2">
          <option value="students">Élèves</option>
          <option value="enseignants">Enseignants</option>
          <option value="inscriptions">Inscriptions</option>
        </select>
      </label>
      <button @click="start" class="btn">Lancer un export</button>
    </div>

    <div v-if="exportsList.length === 0" class="text-sm text-gray-500">Aucun export en cours.</div>
    <ul>
      <li v-for="e in exportsList" :key="e.id" class="py-3 px-4 mb-2 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div class="space-y-1 text-sm">
          <div><span class="font-semibold">ID :</span> {{ e.id }}</div>
          <div><span class="font-semibold">Type :</span> {{ e.params?.type || e.type || 'élèves' }}</div>
          <div><span class="font-semibold">Statut :</span> {{ e.status }}</div>
          <div v-if="e.createdAt"><span class="font-semibold">Date :</span> {{ e.createdAt }}</div>
          <div v-if="e.filename"><span class="font-semibold">Fichier :</span> {{ e.filename }}</div>
        </div>
        <button v-if="e.filename" @click="download(e.id)" class="btn btn-sm">Télécharger</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { startExport, listExports, downloadExport } from '@/api/admin'

const exportsList = ref<Array<any>>([])
const message = ref<string>('')
const exportType = ref<'students' | 'enseignants' | 'inscriptions'>('students')

onMounted(load)

async function load() {
  try {
    exportsList.value = await listExports()
  } catch (e) {
    console.error(e)
    message.value = 'Impossible de charger les exports.'
  }
}

async function start() {
  try {
    const res = await startExport({ type: exportType.value })
    exportsList.value.unshift(res)
    message.value = 'Export lancé.'
  } catch (e) {
    console.error(e)
    message.value = 'Échec du lancement de l’export.'
  }
}

async function download(exportId: string) {
  try {
    const response = await downloadExport(exportId)
    const contentType = (response.headers['content-type'] as string | undefined) || 'application/octet-stream'
    const disposition = response.headers['content-disposition'] as string | undefined
    const filename = disposition?.match(/filename="?([^";]+)"?/)?.[1] || `export-${exportId}`
    const blob = new Blob([response.data], { type: contentType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error(e)
    message.value = 'Impossible de télécharger l’export.'
  }
}
</script>

<style scoped>
.btn { @apply px-3 py-1 bg-sky-600 text-white rounded }
</style>
