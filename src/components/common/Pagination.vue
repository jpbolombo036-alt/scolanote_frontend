<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <button @click="$emit('prev')" :disabled="page === 0" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
        Précédent
      </button>
      <button @click="$emit('next')" :disabled="page >= totalPages - 1" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
        Suivant
      </button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Affichage de <span class="font-medium">{{ startItem }}</span> à <span class="font-medium">{{ endItem }}</span> sur <span class="font-medium">{{ totalElements }}</span> résultats
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button @click="$emit('prev')" :disabled="page === 0" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 disabled:opacity-50">
            <span class="sr-only">Précédent</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>
          <button v-for="pageNum in visiblePages" :key="pageNum" @click="$emit('goTo', pageNum)" :class="[page === pageNum ? 'bg-primary-50 text-primary-600' : 'text-gray-900 hover:bg-gray-50', 'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:outline-offset-0']">
            {{ pageNum + 1 }}
          </button>
          <button @click="$emit('next')" :disabled="page >= totalPages - 1" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 disabled:opacity-50">
            <span class="sr-only">Suivant</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: Number,
  size: Number,
  totalElements: Number,
  totalPages: Number
})

const startItem = computed(() => props.page * props.size + 1)
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
