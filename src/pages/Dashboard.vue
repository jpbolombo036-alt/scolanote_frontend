<template>
  <div class="space-y-4">
    <div class="lg:hidden bg-brand-500 rounded-xl p-5 text-white">
      <p class="text-sm font-medium text-blue-100">Bonjour,</p>
      <h1 class="text-2xl font-bold mt-1">{{ authStore.user?.username || 'Utilisateur' }} 👋</h1>
      <p class="text-sm text-blue-100 mt-1">Bienvenue sur GestBulletin</p>
    </div>

    <div class="hidden lg:block">
      <h1 class="text-2xl font-extrabold text-ink tracking-tight">Tableau de bord</h1>
      <p class="text-sm text-ink-muted mt-1">Vue d'ensemble de l'établissement</p>
    </div>

    <DashboardStatsCards :stats="stats" :loading="loading" />

    <DashboardRecentBulletins :bulletins="recentBulletins" :loading="loading" />

    <div class="hidden lg:grid grid-cols-2 gap-5">
      <DashboardMentionDistribution :distribution="mentionDistribution" :total-bulletins="stats.reportCards" />
      <DashboardRecentActivities :activities="activities" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import { getDashboard } from '@/api/dashboard'
import DashboardStatsCards from '@/components/dashboard/DashboardStatsCards.vue'
import DashboardRecentBulletins from '@/components/dashboard/DashboardRecentBulletins.vue'
import DashboardMentionDistribution from '@/components/dashboard/DashboardMentionDistribution.vue'
import DashboardRecentActivities from '@/components/dashboard/DashboardRecentActivities.vue'

const authStore = useAuthStore()
const router = useRouter()

const stats = ref({
  students: 0,
  classrooms: 0,
  reportCards: 0,
  average: null
})

const loading = ref(false)
const recentBulletins = ref([])
const mentionDistribution = ref([])
const activities = ref([])

const avatarColors = ['bg-brand-500', 'bg-brand-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500']

const MENTIONS = [
  { label: 'Excellent', color: '#0B8C4C' },
  { label: 'Très Bien', color: '#01B574' },
  { label: 'Bien', color: '#0061FF' },
  { label: 'Assez Bien', color: '#FFB547' },
  { label: 'Passable', color: '#EE5D50' },
  { label: 'Insuffisant', color: '#E31A1A' }
]

function getCount(res) {
  if (res.status !== 'fulfilled' || !res.value?.data) return 0
  const d = res.value.data
  return d.totalElements ?? (Array.isArray(d) ? d.length : 0)
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
  if (avg >= 85) return 'Excellent'
  if (avg >= 70) return 'Très Bien'
  if (avg >= 60) return 'Bien'
  if (avg >= 50) return 'Passable'
  return 'Insuffisant'
}

function normalizeMention(raw, moyenne) {
  if (!raw) return mentionFromAverage(moyenne)
  const m = String(raw).trim()
  const known = MENTIONS.find(x => x.label.toLowerCase() === m.toLowerCase())
  if (known) return known.label
  const aliases = {
    excellent: 'Excellent',
    ex: 'Excellent',
    tb: 'Très Bien',
    'tres bien': 'Très Bien',
    'très bien': 'Très Bien',
    b: 'Bien',
    bien: 'Bien',
    ab: 'Assez Bien',
    'assez bien': 'Assez Bien',
    p: 'Passable',
    passable: 'Passable',
    i: 'Insuffisant',
    insuffisant: 'Insuffisant'
  }
  return aliases[m.toLowerCase()] || mentionFromAverage(moyenne)
}

function toMoyenne(item) {
  let moyenne = Number(item.moyenneGenerale ?? item.moyenne ?? item.pourcentage ?? NaN)
  if (Number.isFinite(moyenne) && moyenne > 20) moyenne = moyenne / 5
  return Number.isFinite(moyenne) ? moyenne : null
}

function mapBulletin(item, index) {
  const moyenne = toMoyenne(item)
  const initials = (item.student || '')
    .split(/\s+/)
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return {
    id: item.id ?? index,
    student: item.student || 'Élève',
    initials: initials || 'EL',
    avatarColor: avatarColors[index % avatarColors.length],
    classe: item.classe || '—',
    trimestre: item.trimestre || '—',
    moyenne,
    mention: normalizeMention(item.mention, moyenne),
    date: item.date || '—',
    rawDate: item.date || null
  }
}

function buildMentionDistribution(bulletins) {
  const counts = Object.fromEntries(MENTIONS.map(m => [m.label, 0]))
  let total = 0

  for (const b of bulletins) {
    const mention = normalizeMention(b.mention, b.moyenne)
    if (counts[mention] != null) {
      counts[mention] += 1
      total += 1
    }
  }

  if (!total) return []

  return MENTIONS
    .map(m => ({
      label: m.label,
      color: m.color,
      percent: Math.round((counts[m.label] / total) * 100)
    }))
    .filter(m => m.percent > 0)
}

function getActivityIcon(type) {
  const map = {
    bulletin: CheckCircle2,
    student: UserPlus,
    archive: FileText,
    grade: Star,
    classroom: School
  }
  return map[type] || FileText
}

function getActivityBg(type) {
  const map = {
    bulletin: 'bg-emerald-50',
    student: 'bg-blue-50',
    archive: 'bg-amber-50',
    grade: 'bg-violet-50',
    classroom: 'bg-sky-50'
  }
  return map[type] || 'bg-slate-100'
}

function getActivityColor(type) {
  const map = {
    bulletin: 'text-emerald-600',
    student: 'text-blue-600',
    archive: 'text-amber-600',
    grade: 'text-violet-600',
    classroom: 'text-sky-600'
  }
  return map[type] || 'text-slate-600'
}

async function fetchStats() {
  loading.value = true
  try {
    const data = await getDashboard()

    stats.value.students = data.stats?.students ?? 0
    stats.value.classrooms = data.stats?.classrooms ?? 0
    stats.value.reportCards = data.stats?.reportCards ?? 0
    stats.value.average = data.stats?.average ?? null

    recentBulletins.value = (data.recentBulletins || []).map((item, index) => mapBulletin(item, index))

    mentionDistribution.value = buildMentionDistribution(recentBulletins.value)

    activities.value = (data.activities || []).map((act, index) => ({
      id: `activity-${index}`,
      text: act.text,
      time: act.time,
      icon: getActivityIcon(act.type),
      bg: getActivityBg(act.type),
      color: getActivityColor(act.type),
      sortKey: act.time ? new Date(act.time).getTime() : index
    }))
  } catch (e) {
    console.error('Erreur chargement dashboard:', e)
  } finally {
    loading.value = false
  }
}

onBeforeRouteUpdate(async () => {
  await fetchStats()
})

onMounted(fetchStats)
</script>
