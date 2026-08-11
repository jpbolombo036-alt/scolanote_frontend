<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
    <div
      v-for="card in cards"
      :key="card.label"
      class="bg-white dark:bg-[#0d1527] rounded-xl shadow-card border border-slate-100/80 dark:border-slate-800 p-4 lg:p-5"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs font-medium text-ink-soft">{{ card.label }}</p>
          <p class="text-2xl lg:text-3xl font-extrabold text-ink mt-1 tracking-tight">
            {{ loading ? '—' : card.value }}
          </p>
          <p v-if="card.trend" :class="['text-xs font-semibold mt-1', card.trendClass]">
            {{ card.trend }}
          </p>
        </div>
        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', card.iconBg]">
          <component :is="card.icon" :class="['w-5 h-5', card.iconColor]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Users, Layers, FileText, TrendingUp } from 'lucide-vue-next'

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({ students: 0, classrooms: 0, reportCards: 0, average: null })
  },
  loading: Boolean
})

const cards = computed(() => [
  {
    label: 'Élèves',
    value: props.stats.students,
    trend: props.stats.students ? `${props.stats.students} inscrits` : null,
    trendClass: 'text-brand-500',
    icon: Users,
    iconBg: 'bg-brand-50',
    iconColor: 'text-brand-500'
  },
  {
    label: 'Classes',
    value: props.stats.classrooms,
    trend: props.stats.classrooms ? `${props.stats.classrooms} actives` : null,
    trendClass: 'text-emerald-500',
    icon: Layers,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500'
  },
  {
    label: 'Bulletins',
    value: props.stats.reportCards,
    trend: props.stats.reportCards ? `${props.stats.reportCards} générés` : null,
    trendClass: 'text-amber-500',
    icon: FileText,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500'
  },
  {
    label: 'Moy. Générale',
    value: props.stats.average != null ? formatMoyenne(props.stats.average) : '—',
    trend: props.stats.average != null ? 'Sur 20' : null,
    trendClass: 'text-emerald-500',
    icon: TrendingUp,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500'
  }
])

function formatMoyenne(avg) {
  if (avg == null || Number.isNaN(Number(avg))) return '—'
  return Number(avg).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>
