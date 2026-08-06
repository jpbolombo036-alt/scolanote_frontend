<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-xl font-semibold mb-4">Import / Export</h1>
    <div class="mb-4">
      <input ref="fileInput" type="file" @change="onFile" class="block w-full rounded border border-slate-300 p-2" />
    </div>
    <div v-if="errorMessage" class="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">{{ errorMessage }}</div>
    <div v-if="result" class="mt-4 bg-slate-50 p-3 rounded text-sm">
      <div class="font-semibold mb-2">Résultat de l'import</div>
      <pre class="whitespace-pre-wrap">{{ formattedResult }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { uploadImport } from '@/api/admin'

const fileInput = ref<HTMLInputElement | null>(null)
const result = ref<any>(null)
const errorMessage = ref<string>('')

function onFile(e: Event) {
  const el = e.target as HTMLInputElement
  const f = el.files?.[0]
  if (!f) return
  uploadImport(f)
    .then(r => {
      result.value = r
      errorMessage.value = ''
    })
    .catch(err => {
      console.error(err)
      result.value = null
      errorMessage.value = 'Échec de l’import.'
    })
}

const formattedResult = computed(() => {
  return result.value ? JSON.stringify(result.value, null, 2) : ''
})
</script>

<style scoped>
/* minimal */
</style>
