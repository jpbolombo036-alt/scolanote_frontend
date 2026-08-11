<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6 md:p-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Informations de l'élève</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accueil / Élèves / Détail</p>
        </div>
        <button
          @click="$router.back()"
          class="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Retour
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent"></div>
    </div>

    <div v-else-if="error" class="border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600 rounded-xl">
      {{ error }}
    </div>

    <div v-else-if="student" class="grid gap-6">
      <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Matricule</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ student.matricule || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Nom complet</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ fullName }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Sexe</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ student.sexe === 'M' ? 'Masculin' : student.sexe === 'F' ? 'Féminin' : '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Date de naissance</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ student.dateNaissance || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Lieu de naissance</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ student.lieuNaissance || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">État</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ student.etat || '—' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6">
        <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4">Classe(s)</h2>
        <div v-if="relatedLoading" class="text-sm text-slate-500">Chargement des inscriptions...</div>
        <div v-else>
          <div v-if="enrollments.length === 0" class="text-sm text-slate-500">Aucune inscription trouvée.</div>
          <div v-else class="space-y-3">
            <div v-for="enrollment in enrollments" :key="enrollment.id" class="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Classe</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ enrollment.classroomNom || '—' }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-300">{{ enrollment.etat || '—' }}</span>
                  <button
                    @click="onGenerateBulletin(enrollment.id)"
                    class="px-3 py-1 text-xs rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition"
                  >
                    Générer bulletin
                  </button>
                </div>
              </div>
              <div class="mt-3 text-sm text-slate-500 dark:text-slate-400 space-y-1">
                <p><span class="font-semibold text-slate-700 dark:text-slate-300">Inscription :</span> {{ formatDate(enrollment.dateInscription) }}</p>
                <p><span class="font-semibold text-slate-700 dark:text-slate-300">Ordre :</span> {{ enrollment.numeroOrdre != null ? enrollment.numeroOrdre : '—' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6">
        <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4">Discipline</h2>
        <div v-if="relatedLoading" class="text-sm text-slate-500">Chargement des fiches de discipline...</div>
        <div v-else>
          <div v-if="disciplines.length === 0" class="text-sm text-slate-500">Aucune fiche de discipline pour cet élève.</div>
          <div v-else class="space-y-3">
            <div v-for="discipline in disciplines" :key="discipline.id" class="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Trimestre</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ discipline.periodNom || '—' }}</p>
                </div>
                <span class="text-[11px] font-semibold uppercase rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-600 dark:text-slate-300">{{ formatDate(discipline.createdAt) }}</span>
              </div>
              <div class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p><span class="font-semibold text-slate-900 dark:text-white">Conduite :</span> {{ discipline.conduite || '—' }}</p>
                <p><span class="font-semibold text-slate-900 dark:text-white">Application :</span> {{ discipline.application || '—' }}</p>
                <p><span class="font-semibold text-slate-900 dark:text-white">Observation :</span> {{ discipline.observation || '—' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6">
        <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4">Bulletins</h2>
        <div v-if="relatedLoading" class="text-sm text-slate-500">Chargement des bulletins...</div>
        <div v-else>
          <div v-if="reportCards.length === 0" class="text-sm text-slate-500">Aucun bulletin disponible pour cet élève.</div>
          <div v-else class="space-y-3">
            <div v-for="reportCard in reportCards" :key="reportCard.id" class="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Période</p>
                   <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ reportCard.periodNom || reportCard.trimesterNom || '—' }}</p>
                </div>
                <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-300">{{ reportCard.statut || reportCard.mention || '—' }}</span>
              </div>
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                <div><span class="font-semibold text-slate-900 dark:text-white">Classe :</span> {{ reportCard.classroomNom || '—' }}</div>
                <div><span class="font-semibold text-slate-900 dark:text-white">Mention :</span> {{ reportCard.mention || '—' }}</div>
                <div><span class="font-semibold text-slate-900 dark:text-white">Décision :</span> {{ reportCard.decision || '—' }}</div>
                <div><span class="font-semibold text-slate-900 dark:text-white">Pourcentage :</span> {{ reportCard.pourcentage != null ? formatNumber(reportCard.pourcentage) + '%' : '—' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6">
        <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4">Informations parentales</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Téléphone parent</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ student.telephoneParent || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email parent</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ student.emailParent || '—' }}</p>
          </div>
          <div class="lg:col-span-2">
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Adresse</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ student.adresse || '—' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'
import { getDisciplinesByStudent } from '@/api/disciplines'
import { getEnrollmentsByStudent } from '@/api/enrollments'
import { getReportCardsByEnrollment, generateBulletinForEnrollment } from '@/api/report-cards'
import type { DisciplineResponse, EnrollmentResponse, ReportCardResponse, StudentResponse } from '@/types'
import { AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const student = ref<StudentResponse | null>(null)
const loading = ref(false)
const error = ref(null)
const relatedLoading = ref(false)
const relatedError = ref(null)
const enrollments = ref<EnrollmentResponse[]>([])
const disciplines = ref<DisciplineResponse[]>([])
const reportCards = ref<ReportCardResponse[]>([])
const periods = ref<any[]>([])

const fullName = computed(() => {
  if (!student.value) return '—'
  return [student.value.nom, student.value.postnom, student.value.prenom].filter(Boolean).join(' ') || '—'
})

function formatNumber(value: number | string | null | undefined): string {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return Number(value).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(value: string | number | Date | null | undefined): string {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleDateString('fr-FR')
  } catch {
    return String(value)
  }
}

async function loadStudentRelatedData(studentId: number | string) {
  relatedLoading.value = true
  relatedError.value = null
  try {
    enrollments.value = await getEnrollmentsByStudent(Number(studentId))
    disciplines.value = await getDisciplinesByStudent(Number(studentId))
    if (enrollments.value.length > 0) {
      const reportCardLists = await Promise.all(
        enrollments.value.map(enrollment => getReportCardsByEnrollment(enrollment.id))
      )
      reportCards.value = reportCardLists.flat()
    } else {
      reportCards.value = []
    }
  } catch (e: any) {
    relatedError.value = e.response?.data?.message || 'Erreur lors du chargement des données associées'
  } finally {
    relatedLoading.value = false
  }
}

async function loadPeriods() {
  try {
    const res = await api.get('/api/periodes')
    const data = res.data
    periods.value = Array.isArray(data) ? data : (data.content || [])
  } catch (e) {
    console.error('Erreur chargement périodes', e)
  }
}

async function loadStudent() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get(`/api/eleves/${route.params.id}`)
    student.value = response.data
    if (student.value?.id) {
      await loadStudentRelatedData(student.value.id)
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || "Erreur lors du chargement des informations de l'élève"
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadPeriods()
  await loadStudent()
})

async function onGenerateBulletin(enrollmentId: number) {
  try {
    if (!periods.value || periods.value.length === 0) {
      await loadPeriods()
    }
    const list = periods.value.map(p => `${p.id}: ${p.nom}`).join('\n')
    const input = window.prompt(`Sélectionnez la période (id) parmi:\n${list}`)
    if (!input) return
    const periodId = Number(input)
    if (Number.isNaN(periodId)) {
      alert('ID de période invalide')
      return
    }
    await generateBulletinForEnrollment(enrollmentId, periodId)
    // refresh
    if (student.value?.id) await loadStudentRelatedData(student.value.id)
  } catch (e: any) {
    alert(e.response?.data?.message || e.message || 'Erreur lors de la génération')
  }
}
</script>
