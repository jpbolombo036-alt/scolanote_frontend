<template>
  <div class="space-y-4">
    <!-- Title Card -->
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-xl px-4 lg:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h2 class="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{{ title }}</h2>
      <div class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <!-- Search Card -->
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-xl px-4 lg:px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="relative w-full sm:w-96">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-emerald-500 transition"
        />
      </div>
      <button
        @click="$emit('refresh')"
        class="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/25 transition"
      >
        <span class="flex items-center justify-center gap-2">
          <RefreshCw :class="['w-4 h-4', { 'animate-spin': loading }]" />
          <span>{{ searchButtonText }}</span>
        </span>
      </button>
    </div>

    <!-- Table Card -->
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-xl overflow-hidden">
      <div v-if="loading" class="py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
        <p class="text-xs text-slate-400 font-medium mt-3">{{ loadingText }}</p>
      </div>
      <div v-else-if="empty" class="py-12 text-center">
        <EmptyState :message="emptyMessage" />
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th v-for="column in columns" :key="column.key" :class="column.headerClass || 'px-6 py-4'">
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <slot />
          </tbody>
        </table>
      </div>

      <div v-if="$slots.footer" class="border-t border-slate-100 dark:border-slate-800/80">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import EmptyState from '@/components/common/EmptyState.vue'
import { Search, RefreshCw } from 'lucide-vue-next'

defineProps({
  title: String,
  searchPlaceholder: {
    type: String,
    default: 'Rechercher...'
  },
  searchButtonText: {
    type: String,
    default: 'Rechercher'
  },
  refreshTitle: {
    type: String,
    default: 'Actualiser'
  },
  loadingText: {
    type: String,
    default: 'Chargement...'
  },
  emptyMessage: {
    type: String,
    default: 'Aucun élément trouvé'
  },
  loading: Boolean,
  empty: Boolean,
  modelValue: String,
  columns: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:modelValue', 'refresh'])
</script>
