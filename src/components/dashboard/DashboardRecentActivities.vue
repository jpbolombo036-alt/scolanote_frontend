<template>
  <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-xl p-5">
    <h3 class="text-base font-bold text-ink mb-5">Activités récentes</h3>
    <div v-if="!activities.length" class="py-10 text-center text-sm text-ink-muted">
      Aucune activité récente
    </div>
    <ul v-else class="space-y-4">
      <li v-for="act in activities" :key="act.id" class="flex items-start gap-3">
        <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', act.bg]">
          <component :is="act.icon" :class="['w-4 h-4', act.color]" />
        </div>
        <div class="flex-1 min-w-0 flex items-start justify-between gap-3">
          <p class="text-sm text-ink leading-snug">{{ act.text }}</p>
          <span class="text-xs text-ink-muted whitespace-nowrap">{{ act.time }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  activities: {
    type: Array,
    default: () => []
  }
})
</script>
