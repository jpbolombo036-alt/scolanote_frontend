<template>
  <div class="space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- PAGE HEADER BANNER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <span class="inline-flex items-center text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-2">
          TABLEAU DE BORD SCOLAIRE
        </span>
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Suivi d'établissement</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Collectes, effectifs, évaluations, bulletins et répartitions académiques</p>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center gap-3">
        <div class="hidden sm:flex items-center text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl shadow-sm">
          <Clock class="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 mr-2" />
          <span>Mise à jour {{ lastUpdated }}</span>
        </div>

        <button
          @click="fetchStats"
          :disabled="loading"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center gap-2 disabled:opacity-60"
        >
          <RefreshCw :class="['w-4 h-4', { 'animate-spin': loading }]" />
          <span>Actualiser</span>
        </button>
      </div>
    </div>

    <!-- MAIN HERO CONTAINER (PORTFOLIO / WALLET STYLE HERO) -->
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-xl space-y-6 transition-colors duration-200">
      
      <!-- Container Top Header -->
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sparkles class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white leading-snug">Vue d'ensemble Scolaire</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Statistiques principales et données clés de l'établissement</p>
          </div>
        </div>

        <button
          @click="fetchStats"
          class="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 px-3.5 py-2 rounded-xl transition"
        >
          <RefreshCw class="w-3.5 h-3.5 text-slate-400" />
          Actualiser
        </button>
      </div>

      <!-- 2 LARGE FEATURED HERO CARDS -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- CARD 1: EMERALD HERO CARD (ÉLÈVES) -->
        <div class="relative bg-gradient-to-br from-[#059669] via-[#047857] to-[#064e3b] border border-emerald-400/30 rounded-3xl p-6 sm:p-7 shadow-xl overflow-hidden text-white flex flex-col justify-between group">
          <!-- Background Glow Effect -->
          <div class="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
          
          <div>
            <!-- Header inside card -->
            <div class="flex items-center justify-between mb-4">
              <span class="text-[11px] font-black uppercase tracking-wider text-emerald-200/90">
                SOLDE & EFFECTIFS
              </span>
              <div class="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                <Users class="w-5 h-5 text-white" />
              </div>
            </div>

            <!-- Big Stat Display -->
            <div class="flex items-baseline space-x-2 my-2">
              <span class="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {{ loading ? '...' : stats.students }}
              </span>
              <span class="text-xl font-bold text-emerald-200">Élèves</span>
            </div>
            <p class="text-xs text-emerald-100/80 font-medium">Effectif total des élèves inscrits cette année</p>
          </div>

          <!-- Card Sub-footer Row -->
          <div class="mt-8 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span class="text-emerald-200/70 block text-[10px] uppercase font-semibold">Classes actives</span>
              <span class="font-bold text-white text-sm">{{ stats.classrooms }} Salles</span>
            </div>
            <div>
              <span class="text-emerald-200/70 block text-[10px] uppercase font-semibold">Professeurs</span>
              <span class="font-bold text-white text-sm">{{ stats.teachers }} Enseignants</span>
            </div>
            
            <div class="flex items-center space-x-1.5 bg-black/20 backdrop-blur p-1 rounded-xl border border-white/10">
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white text-slate-900">TOUS</span>
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-emerald-100 hover:bg-white/10 cursor-pointer">PRIMAIRE</span>
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-emerald-100 hover:bg-white/10 cursor-pointer">SECONDAIRE</span>
            </div>
          </div>
        </div>

        <!-- CARD 2: BLUE HERO CARD (BULLETINS) -->
        <div class="relative bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a] border border-blue-400/30 rounded-3xl p-6 sm:p-7 shadow-xl overflow-hidden text-white flex flex-col justify-between group">
          <!-- Background Glow Effect -->
          <div class="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

          <div>
            <!-- Header inside card -->
            <div class="flex items-center justify-between mb-4">
              <span class="text-[11px] font-black uppercase tracking-wider text-blue-200/90">
                BULLETINS ET ÉVALUATIONS
              </span>
              <div class="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                <FileText class="w-5 h-5 text-white" />
              </div>
            </div>

            <!-- Big Stat Display -->
            <div class="flex items-baseline space-x-2 my-2">
              <span class="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {{ loading ? '...' : stats.reportCards }}
              </span>
              <span class="text-xl font-bold text-blue-200">Bulletins</span>
            </div>
            <p class="text-xs text-blue-100/80 font-medium">Nombre total de bulletins édités et enregistrés</p>
          </div>

          <!-- Card Sub-footer Row -->
          <div class="mt-8 pt-5 border-t border-white/15 flex items-center justify-between text-xs">
            <div>
              <span class="text-blue-200/70 block text-[10px] uppercase font-semibold">Année Scolaire</span>
              <span class="font-bold text-white text-sm">2025 - 2026</span>
            </div>
            <div>
              <span class="text-blue-200/70 block text-[10px] uppercase font-semibold">Période Active</span>
              <span class="font-bold text-white text-sm">Trimestre 3</span>
            </div>
            <div>
              <span class="text-blue-200/70 block text-[10px] uppercase font-semibold">Statut</span>
              <span class="inline-flex items-center font-bold text-emerald-300 text-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span> Validé
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- SECONDARY METRICS GRID (5 CARDS) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      <!-- Metric 1: Écoles -->
      <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80 rounded-2xl p-5 shadow-sm dark:shadow-lg flex items-center justify-between transition-all duration-200 hover:-translate-y-1">
        <div>
          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Écoles</span>
          <span class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{{ loading ? '...' : stats.schools }}</span>
          <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center mt-1">
            <TrendingUp class="w-3 h-3 mr-1" /> Établissements
          </span>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <School class="w-5 h-5" />
        </div>
      </div>

      <!-- Metric 2: Enseignants -->
      <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80 rounded-2xl p-5 shadow-sm dark:shadow-lg flex items-center justify-between transition-all duration-200 hover:-translate-y-1">
        <div>
          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Enseignants</span>
          <span class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{{ loading ? '...' : stats.teachers }}</span>
          <span class="text-[10px] text-blue-600 dark:text-blue-400 font-medium flex items-center mt-1">
            <UserCheck class="w-3 h-3 mr-1" /> Professeurs
          </span>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <UserCheck class="w-5 h-5" />
        </div>
      </div>

      <!-- Metric 3: Classes -->
      <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80 rounded-2xl p-5 shadow-sm dark:shadow-lg flex items-center justify-between transition-all duration-200 hover:-translate-y-1">
        <div>
          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Classes</span>
          <span class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{{ loading ? '...' : stats.classrooms }}</span>
          <span class="text-[10px] text-purple-600 dark:text-purple-400 font-medium flex items-center mt-1">
            <Layers class="w-3 h-3 mr-1" /> Salles actives
          </span>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <Layers class="w-5 h-5" />
        </div>
      </div>

      <!-- Metric 4: Matières -->
      <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80 rounded-2xl p-5 shadow-sm dark:shadow-lg flex items-center justify-between transition-all duration-200 hover:-translate-y-1">
        <div>
          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Matières</span>
          <span class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{{ loading ? '...' : stats.subjects }}</span>
          <span class="text-[10px] text-sky-600 dark:text-sky-400 font-medium flex items-center mt-1">
            <BookOpen class="w-3 h-3 mr-1" /> Cours dispensés
          </span>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
          <BookOpen class="w-5 h-5" />
        </div>
      </div>

      <!-- Metric 5: Évaluations -->
      <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80 rounded-2xl p-5 shadow-sm dark:shadow-lg flex items-center justify-between transition-all duration-200 hover:-translate-y-1">
        <div>
          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Évaluations</span>
          <span class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{{ loading ? '...' : stats.assessments }}</span>
          <span class="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center mt-1">
            <CheckSquare class="w-3 h-3 mr-1" /> Contrôles enregistrés
          </span>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <CheckSquare class="w-5 h-5" />
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import {
  Clock,
  RefreshCw,
  Sparkles,
  Users,
  FileText,
  School,
  UserCheck,
  Layers,
  BookOpen,
  CheckSquare,
  TrendingUp
} from 'lucide-vue-next'

const stats = ref({
  schools: 0,
  students: 0,
  teachers: 0,
  reportCards: 0,
  classrooms: 0,
  subjects: 0,
  assessments: 0
})

const loading = ref(false)
const lastUpdated = ref('')

function updateTimestamp() {
  const now = new Date()
  lastUpdated.value = `${now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
}

async function fetchStats() {
  loading.value = true
  try {
    const [schoolsRes, studentsRes, teachersRes, bulletinsRes, classroomsRes, subjectsRes, assessmentsRes] = await Promise.allSettled([
      api.get('/api/ecoles'),
      api.get('/api/eleves'),
      api.get('/api/enseignants'),
      api.get('/api/bulletins'),
      api.get('/api/salles'),
      api.get('/api/matieres'),
      api.get('/api/evaluations')
    ])

    const getCount = (res) => {
      if (res.status === 'fulfilled' && res.value?.data) {
        const d = res.value.data
        return d.totalElements ?? (Array.isArray(d) ? d.length : 0)
      }
      return 0
    }

    stats.value.schools = getCount(schoolsRes)
    stats.value.students = getCount(studentsRes)
    stats.value.teachers = getCount(teachersRes)
    stats.value.reportCards = getCount(bulletinsRes)
    stats.value.classrooms = getCount(classroomsRes)
    stats.value.subjects = getCount(subjectsRes)
    stats.value.assessments = getCount(assessmentsRes)

    updateTimestamp()
  } catch (e) {
    console.error('Erreur chargement stats:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  updateTimestamp()
  fetchStats()
})
</script>
