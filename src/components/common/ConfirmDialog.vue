<template>
  <div v-if="show" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
      <div class="flex items-center space-x-3.5">
        <div class="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
          <AlertTriangle class="w-5 h-5" />
        </div>
        <h3 class="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{{ title }}</h3>
      </div>

      <p class="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{{ message }}</p>

      <div class="flex justify-end gap-3 pt-2">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2.5 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {{ cancelText }}
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-600/25 transition"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle } from 'lucide-vue-next'

defineProps({
  show: Boolean,
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    default: 'Êtes-vous sûr de vouloir effectuer cette action ?'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  }
})

defineEmits(['confirm', 'cancel'])
</script>
