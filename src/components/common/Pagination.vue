<template>
  <div class="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0d1527] px-4 py-3 sm:px-6 transition-colors duration-200">
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="$emit('prev')"
        :disabled="page === 0"
        class="relative inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition"
      >
        Précédent
      </button>
      <button
        @click="$emit('next')"
        :disabled="page >= totalPages - 1"
        class="relative ml-3 inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition"
      >
        Suivant
      </button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Affichage de <span class="font-bold text-slate-800 dark:text-slate-200">{{ startItem }}</span> à <span class="font-bold text-slate-800 dark:text-slate-200">{{ endItem }}</span> sur <span class="font-bold text-slate-800 dark:text-slate-200">{{ totalElements }}</span> résultats
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-xl shadow-sm overflow-hidden" aria-label="Pagination">
          <button
            @click="$emit('prev')"
            :disabled="page === 0"
            class="relative inline-flex items-center px-3 py-2 text-slate-400 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button
            v-for="pageNum in visiblePages"
            :key="pageNum"
            @click="$emit('goTo', pageNum)"
            :class="[
              page === pageNum
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-white dark:bg-[#0d1527] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
              'relative inline-flex items-center px-3.5 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700/60 transition'
            ]"
          >
            {{ pageNum + 1 }}
          </button>
          <button
            @click="$emit('next')"
            :disabled="page >= totalPages - 1"
            class="relative inline-flex items-center px-3 py-2 text-slate-400 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  page: { type: Number, default: 0 },
  size: { type: Number, default: 10 },
  totalElements: { type: Number, default: 0 },
  totalPages: { type: Number, default: 1 }
})

const startItem = computed(() => (props.totalElements === 0 ? 0 : props.page * props.size + 1))
const endItem = computed(() => Math.min((props.page + 1) * props.size, props.totalElements))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(0, props.page - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible)
  
  start = Math.max(0, end - maxVisible)
  
  for (let i = start; i < end; i++) {
    pages.push(i)
  }
  return pages
})

defineEmits(['prev', 'next', 'goTo'])
</script>
