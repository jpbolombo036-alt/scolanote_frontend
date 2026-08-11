<template>
  <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-xl overflow-hidden">
    <div class="px-4 lg:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 bg-surface/60 dark:bg-slate-900/80">
      <div class="flex items-center gap-2">
        <FileText class="w-5 h-5 text-brand-500" />
        <h3 class="text-base font-bold text-ink">Derniers bulletins</h3>
      </div>
      <router-link
        to="/bulletins"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 shadow-md shadow-brand-500/25 transition"
      >
        <Plus class="w-4 h-4" />
        <span class="hidden sm:inline">Ajouter un bulletin</span>
        <span class="sm:hidden">Ajouter</span>
      </router-link>
    </div>

    <div class="hidden lg:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-ink-muted text-xs uppercase tracking-wider bg-surface/60 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
            <th class="px-5 py-3 font-semibold">Élève</th>
            <th class="px-5 py-3 font-semibold">Classe</th>
            <th class="px-5 py-3 font-semibold">Trimestre</th>
            <th class="px-5 py-3 font-semibold">Moyenne Générale</th>
            <th class="px-5 py-3 font-semibold">Mention</th>
            <th class="px-5 py-3 font-semibold">Date</th>
            <th class="px-5 py-3 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="px-5 py-10 text-center text-ink-muted">Chargement...</td>
          </tr>
          <tr v-else-if="!bulletins.length">
            <td colspan="7" class="px-5 py-10 text-center text-ink-muted">Aucun bulletin enregistré</td>
          </tr>
          <tr
            v-for="row in bulletins"
            :key="row.id"
            class="border-t border-slate-100 dark:border-slate-800 hover:bg-surface/50 dark:hover:bg-slate-800/30 transition"
          >
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div :class="['w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white', row.avatarColor]">
                  {{ row.initials }}
                </div>
                <span class="font-semibold text-ink">{{ row.student }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-ink-soft">{{ row.classe }}</td>
            <td class="px-5 py-3.5 text-ink-soft">{{ row.trimestre }}</td>
            <td class="px-5 py-3.5">
              <span :class="['font-bold', moyenneColor(row.moyenne)]">{{ formatMoyenne(row.moyenne) }}</span>
            </td>
            <td class="px-5 py-3.5">
              <span :class="['inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold', mentionBadge(row.mention)]">
                {{ row.mention }}
              </span>
            </td>
            <td class="px-5 py-3.5 text-ink-soft">{{ row.date }}</td>
            <td class="px-5 py-3.5">
              <div class="flex items-center justify-end gap-1">
                <router-link :to="`/bulletins/${row.id}`" class="p-2 rounded-lg text-brand-500 hover:bg-brand-50 transition" title="Voir">
                  <Eye class="w-4 h-4" />
                </router-link>
                <router-link to="/bulletins" class="p-2 rounded-lg text-brand-500 hover:bg-brand-50 transition" title="Bulletins">
                  <Pencil class="w-4 h-4" />
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
      <div v-if="loading" class="p-8 text-center text-ink-muted">Chargement...</div>
      <div v-else-if="!bulletins.length" class="p-8 text-center text-ink-muted">Aucun bulletin enregistré</div>
      <div
        v-for="row in bulletins"
        :key="row.id"
        class="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2.5">
            <div :class="['w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white', row.avatarColor]">
              {{ row.initials }}
            </div>
            <div>
              <p class="text-sm font-semibold text-ink">{{ row.student }}</p>
              <p class="text-xs text-ink-muted">{{ row.classe }}</p>
            </div>
          </div>
          <span :class="['inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold', mentionBadge(row.mention)]">
            {{ row.mention }}
          </span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-3 text-ink-soft">
            <span>{{ row.trimestre }}</span>
            <span :class="['font-bold', moyenneColor(row.moyenne)]">{{ formatMoyenne(row.moyenne) }}</span>
          </div>
          <span class="text-ink-muted">{{ row.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FileText, Plus, Eye, Pencil } from 'lucide-vue-next'

const props = defineProps({
  bulletins: {
    type: Array,
    default: () => []
  },
  loading: Boolean
})

function mentionBadge(mention) {
  const map = {
    'Très Bien': 'bg-emerald-50 text-emerald-700',
    'Bien': 'bg-blue-50 text-blue-700',
    'Assez Bien': 'bg-amber-50 text-amber-700',
    'Passable': 'bg-rose-50 text-rose-600',
    'Insuffisant': 'bg-red-50 text-red-600'
  }
  return map[mention] || 'bg-slate-100 text-slate-600'
}

function moyenneColor(avg) {
  if (avg == null) return 'text-ink-soft'
  if (avg >= 14) return 'text-emerald-600'
  if (avg >= 10) return 'text-amber-600'
  return 'text-red-500'
}

function formatMoyenne(avg) {
  if (avg == null || Number.isNaN(Number(avg))) return '—'
  return Number(avg).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>
