<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-xl font-semibold mb-4">Rapports</h1>
    <div v-if="message" class="mb-4 text-sm text-red-600">{{ message }}</div>
    <div v-if="reports.length === 0" class="text-sm text-gray-500">Aucun rapport disponible.</div>
    <ul>
      <li v-for="r in reports" :key="r.key" class="py-2 flex items-center justify-between">
        <div>{{ r.label || r.key }}</div>
        <button @click="download(r.key)" class="btn btn-sm">Télécharger</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listReports, generateReport } from '@/api/admin'
import type { AxiosResponse } from 'axios'

const reports = ref<Array<any>>([])
const message = ref<string>('')

onMounted(async () => {
  try {
    reports.value = await listReports()
  } catch (e) {
    console.error(e)
    message.value = 'Impossible de charger les rapports.'
  }
})

async function download(key: string) {
  try {
    const response: AxiosResponse<ArrayBuffer> = await generateReport(key)
    const contentType = response.headers['content-type'] || 'application/octet-stream'
    const disposition = response.headers['content-disposition'] as string | undefined
    const filename = disposition?.match(/filename="?([^";]+)"?/)?.[1] || `${key}`
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
    message.value = 'Impossible de télécharger le rapport.'
  }
}
</script>

<style scoped>
.btn { @apply px-3 py-1 bg-sky-600 text-white rounded }
.btn-sm { @apply text-sm }
</style>
