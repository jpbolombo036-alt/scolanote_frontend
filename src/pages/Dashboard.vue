<template>
  <div class="space-y-4">
    <!-- Mobile Greeting Header -->
    <div class="lg:hidden bg-brand-500 rounded-2xl p-5 text-white">
      <p class="text-sm font-medium text-blue-100">Bonjour,</p>
      <h1 class="text-2xl font-bold mt-1">{{ authStore.user?.username || 'Utilisateur' }} 👋</h1>
      <p class="text-sm text-blue-100 mt-1">Bienvenue sur GestBulletin</p>
      <div class="mt-3 flex items-center gap-2">
        <select
          v-model="selectedAcademicYear"
          class="bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 text-xs font-medium text-white appearance-none cursor-pointer"
        >
          <option v-for="year in academicYears" :key="year.id" :value="year.id" class="text-slate-900">
            {{ year.libelle }}
          </option>
        </select>
      </div>
    </div>

    <!-- Desktop Greeting (hidden on mobile) -->
    <div class="hidden lg:block">
      <h1 class="text-2xl font-extrabold text-ink tracking-tight">Tableau de bord</h1>
      <p class="text-sm text-ink-muted mt-1">Vue d'ensemble de l'établissement</p>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="bg-white dark:bg-[#0d1527] rounded-2xl shadow-card border border-slate-100/80 dark:border-slate-800 p-4 lg:p-5"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-medium text-ink-soft">{{ card.label }}</p>
            <p class="text-2xl lg:text-3xl font-extrabold text-ink mt-1 tracking-tight">
              {{ loading ? '—' : card.value }}
            </p>
            <p :class="['text-xs font-semibold mt-1', card.trendClass]">
              {{ card.trend }}
            </p>
          </div>
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', card.iconBg]">
            <component :is="card.icon" :class="['w-5 h-5', card.iconColor]" />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Bulletins Section -->
    <div class="bg-white dark:bg-[#0d1527] rounded-2xl shadow-card border border-slate-100/80 dark:border-slate-800 overflow-hidden">
      <div class="px-4 lg:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
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

      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-ink-muted text-xs uppercase tracking-wider bg-surface/60">
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
            <tr v-else-if="!recentBulletins.length">
              <td colspan="7" class="px-5 py-10 text-center text-ink-muted">Aucun bulletin enregistré</td>
            </tr>
            <tr
              v-for="row in recentBulletins"
              :key="row.id"
              class="border-t border-slate-50 hover:bg-surface/50 transition"
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
                  <router-link to="/bulletins" class="p-2 rounded-lg text-brand-500 hover:bg-brand-50 transition" title="Modifier">
                    <Pencil class="w-4 h-4" />
                  </router-link>
                  <button class="p-2 rounded-lg text-red-500 hover:bg-red-50 transition" title="Supprimer">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
        <div v-if="loading" class="p-8 text-center text-ink-muted">Chargement...</div>
        <div v-else-if="!recentBulletins.length" class="p-8 text-center text-ink-muted">Aucun bulletin enregistré</div>
        <div
          v-for="row in recentBulletins"
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

    <!-- Bottom Widgets (Desktop) -->
    <div class="hidden lg:grid grid-cols-2 gap-5">
      <div class="bg-white rounded-2xl shadow-card border border-slate-100/80 p-5">
        <h3 class="text-base font-bold text-ink mb-6">Répartition des mentions</h3>
        <div class="flex flex-col sm:flex-row items-center gap-8">
          <div class="relative w-44 h-44 shrink-0">
            <svg viewBox="0 0 120 120" class="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="42" fill="none" stroke="#EEF2FF" stroke-width="16" />
              <circle
                v-for="(seg, i) in donutSegments"
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
              <span class="text-2xl font-extrabold text-ink">{{ stats.reportCards || '—' }}</span>
              <span class="text-[10px] text-ink-muted font-medium uppercase">Bulletins</span>
            </div>
          </div>
          <ul class="space-y-3 w-full">
            <li v-for="item in mentionDistribution" :key="item.label" class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2.5">
                <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: item.color }"></span>
                <span class="text-ink-soft font-medium">{{ item.label }}</span>
              </div>
              <span class="font-bold text-ink">{{ item.percent }}%</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-card border border-slate-100/80 p-5">
        <h3 class="text-base font-bold text-ink mb-5">Activités récentes</h3>
        <ul class="space-y-4">
          <li v-for="act in activities" :key="act.text" class="flex items-start gap-3">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'
import {
  Users,
  Layers,
  FileText,
  TrendingUp,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  UserPlus,
  Archive
} from 'lucide-vue-next'

const authStore = useAuthStore()

const stats = ref({
  students: 0,
  classrooms: 0,
  reportCards: 0,
  average: null
})

const loading = ref(false)
const recentBulletins = ref([])
const selectedAcademicYear = ref(null)
const academicYears = ref([])

const avatarColors = ['bg-brand-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500']

const mentionDistribution = [
  { label: 'Très Bien', percent: 25, color: '#01B574' },
  { label: 'Bien', percent: 35, color: '#0061FF' },
  { label: 'Assez Bien', percent: 20, color: '#FFB547' },
  { label: 'Passable', percent: 12, color: '#EE5D50' },
  { label: 'Insuffisant', percent: 8, color: '#E31A1A' }
]

const activities = [
  { text: 'Bulletin de Marie Dupont enregistré', time: 'Il y a 2h', icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { text: 'Nouvel élève ajouté : Lucas Petit', time: 'Il y a 4h', icon: UserPlus, bg: 'bg-blue-50', color: 'text-blue-600' },
  { text: 'Bulletin archivé — Trimestre 2', time: 'Il y a 6h', icon: Archive, bg: 'bg-amber-50', color: 'text-amber-600' },
  { text: 'Notes mises à jour pour 5ème A', time: 'Il y a 8h', icon: FileText, bg: 'bg-violet-50', color: 'text-violet-600' },
  { text: 'Classe 4ème B créée', time: 'Hier', icon: Layers, bg: 'bg-sky-50', color: 'text-sky-600' }
]

const statCards = computed(() => [
  {
    label: 'Élèves',
    value: stats.value.students,
    trend: '+ 12 ce mois',
    trendClass: 'text-brand-500',
    icon: Users,
    iconBg: 'bg-brand-50',
    iconColor: 'text-brand-500'
  },
  {
    label: 'Classes',
    value: stats.value.classrooms,
    trend: '+ 1 ce mois',
    trendClass: 'text-emerald-500',
    icon: Layers,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500'
  },
  {
    label: 'Bulletins',
    value: stats.value.reportCards,
    trend: '+ 28 ce mois',
    trendClass: 'text-amber-500',
    icon: FileText,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500'
  },
  {
    label: 'Moy. Générale',
    value: stats.value.average != null ? formatMoyenne(stats.value.average) : '—',
    trend: '↑ 0,75',
    trendClass: 'text-emerald-500',
    icon: TrendingUp,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500'
  }
])

const circumference = 2 * Math.PI * 42
const donutSegments = computed(() => {
  let offset = 0
  return mentionDistribution.map((item) => {
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

function getCount(res) {
  if (res.status === 'fulfilled' && res.value?.data) {
    const d = res.value.data
    return d.totalElements ?? (Array.isArray(d) ? d.length : 0)
  }
  return 0
}

function getList(res) {
  if (res.status !== 'fulfilled' || !res.value?.data) return []
  const d = res.value.data
  if (Array.isArray(d)) return d
  if (Array.isArray(d.content)) return d.content
  return []
}

function mentionFromAverage(avg) {
  if (avg == null || Number.isNaN(avg)) return '—'
  if (avg >= 16) return 'Très Bien'
  if (avg >= 14) return 'Bien'
  if (avg >= 12) return 'Assez Bien'
  if (avg >= 10) return 'Passable'
  return 'Insuffisant'
}

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

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('fr-FR')
}

function mapBulletin(item, index) {
  const studentName =
    item.studentNom ||
    item.eleveNomComplet ||
    item.nomEleve ||
    [item.elevePrenom, item.eleveNom].filter(Boolean).join(' ') ||
    `Élève #${item.id ?? index + 1}`

  let moyenne = Number(item.moyenneGenerale ?? item.moyenne ?? item.pourcentage ?? NaN)
  if (Number.isFinite(moyenne) && moyenne > 20) moyenne = moyenne / 5

  const initials = studentName
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return {
    id: item.id ?? index,
    student: studentName,
    initials: initials || 'EL',
    avatarColor: avatarColors[index % avatarColors.length],
    classe: item.classroomNom || item.classeNom || item.salleNom || '—',
    trimestre: item.trimesterNom || item.periodNom || item.trimestreNom || '—',
    moyenne: Number.isFinite(moyenne) ? moyenne : null,
    mention: item.mention || mentionFromAverage(moyenne),
    date: formatDate(item.dateGeneration || item.createdAt || item.date)
  }
}

async function fetchStats() {
  loading.value = true
  try {
    const [studentsRes, classroomsRes, bulletinsRes, yearsRes] = await Promise.allSettled([
      api.get('/api/eleves'),
      api.get('/api/salles'),
      api.get('/api/bulletins', { params: { page: 0, size: 8 } }),
      api.get('/api/annees-academiques')
    ])

    stats.value.students = getCount(studentsRes)
    stats.value.classrooms = getCount(classroomsRes)
    stats.value.reportCards = getCount(bulletinsRes)

    if (yearsRes.status === 'fulfilled' && yearsRes.value?.data) {
      const yearsData = yearsRes.value.data
      academicYears.value = Array.isArray(yearsData) ? yearsData : (yearsData.content || [])
      const activeYear = academicYears.value.find(y => y.active)
      if (activeYear) {
        selectedAcademicYear.value = activeYear.id
      } else if (academicYears.value.length) {
        selectedAcademicYear.value = academicYears.value[0].id
      }
    }

    const list = getList(bulletinsRes).slice(0, 6).map(mapBulletin)
    recentBulletins.value = list

    const averages = list.map((r) => r.moyenne).filter((n) => n != null)
    stats.value.average = averages.length
      ? averages.reduce((a, b) => a + b, 0) / averages.length
      : 14.25
  } catch (e) {
    console.error('Erreur chargement stats:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>
