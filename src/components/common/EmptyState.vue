<template>
  <div class="flex items-center justify-center p-12 text-center">
    <div class="space-y-3">
      <div class="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
        <Inbox class="w-8 h-8" />
      </div>
      <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { Inbox } from 'lucide-vue-next'

defineProps({
  message: {
    type: String,
    default: 'Aucune donnée disponible pour le moment'
  }
})
</script>
