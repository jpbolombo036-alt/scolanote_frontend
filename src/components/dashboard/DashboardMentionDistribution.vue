<template>
  <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-xl p-5">
    <h3 class="text-base font-bold text-ink mb-6">Répartition des mentions</h3>
    <div v-if="!distribution.length" class="py-10 text-center text-sm text-ink-muted">
      Aucune donnée de mention pour le moment
    </div>
    <div v-else class="flex flex-col sm:flex-row items-center gap-8">
      <div class="relative w-44 h-44 shrink-0">
        <svg viewBox="0 0 120 120" class="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="42" fill="none" stroke="#EEF2FF" stroke-width="16" />
          <circle
            v-for="seg in segments"
            :key="seg.label"
            cx="60"
            cy="60"
            r="42"
            fill="none"
            :stroke="seg.color"
            stroke-width="16"
            :stroke-dasharray="seg.dash"
            :stroke-dashoffset="seg.offset"
            stroke-linecap="butt"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-extrabold text-ink">{{ totalBulletins || '—' }}</span>
          <span class="text-[10px] text-ink-muted font-medium uppercase">Bulletins</span>
        </div>
      </div>
      <ul class="space-y-3 w-full">
        <li v-for="item in distribution" :key="item.label" class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: item.color }"></span>
            <span class="text-ink-soft font-medium">{{ item.label }}</span>
          </div>
          <span class="font-bold text-ink">{{ item.percent }}%</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  distribution: {
    type: Array,
    default: () => []
  },
  totalBulletins: {
    type: Number,
    default: 0
  }
})

const circumference = 2 * Math.PI * 42

const segments = computed(() => {
  let offset = 0
  return props.distribution.map((item) => {
    const length = (item.percent / 100) * circumference
    const seg = {
      label: item.label,
      color: item.color,
      dash: `${length} ${circumference - length}`,
      offset: -offset
    }
    offset += length
    return seg
  })
})
</script>
