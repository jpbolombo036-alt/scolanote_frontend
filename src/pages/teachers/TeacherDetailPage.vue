<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6 md:p-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Informations de l'enseignant</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accueil / Enseignants / Détail</p>
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

    <div v-else-if="teacher" class="grid gap-6">
      <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Nom complet</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ fullName }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Spécialité</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ teacher.specialite || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ teacher.email || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Téléphone</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ teacher.telephone || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Date de naissance</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ formatDate(teacher.dateNaissance) }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Lieu de naissance</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ teacher.lieuNaissance || '—' }}</p>
          </div>
          <div class="lg:col-span-2">
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Adresse</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ teacher.adresse || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">État</p>
            <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ teacher.etat || '—' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">Affectations</h2>
          <span class="text-xs text-slate-500 dark:text-slate-400">{{ assignments.length }} trouvées</span>
        </div>
        <div v-if="relatedLoading" class="text-sm text-slate-500">Chargement des affectations...</div>
        <div v-else-if="relatedError" class="text-sm text-red-600 dark:text-red-400">{{ relatedError }}</div>
        <div v-else>
          <div v-if="assignments.length === 0" class="text-sm text-slate-500">Aucune affectation trouvée pour cet enseignant.</div>
          <div v-else class="space-y-3">
            <div v-for="assignment in assignments" :key="assignment.id" class="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Classe</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ assignment.classroomNom || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Matière</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ assignment.subjectNom || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Affecté le</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ formatDate(assignment.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTeacher } from '@/api/teachers'
import { getTeachingAssignmentsByTeacher } from '@/api/teaching-assignments'
import type { TeacherResponse, TeachingAssignmentResponse } from '@/types'

const route = useRoute()
const teacher = ref<TeacherResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const relatedLoading = ref(false)
const relatedError = ref<string | null>(null)
const assignments = ref<TeachingAssignmentResponse[]>([])

const fullName = computed(() => {
  if (!teacher.value) return '—'
  return [teacher.value.nom, teacher.value.postnom, teacher.value.prenom].filter(Boolean).join(' ') || '—'
})

function formatDate(value?: string) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleDateString('fr-FR')
  } catch {
    return value
  }
}

async function loadTeacherRelatedData(teacherId: number) {
  relatedLoading.value = true
  relatedError.value = null
  try {
    assignments.value = await getTeachingAssignmentsByTeacher(teacherId)
  } catch (e: any) {
    relatedError.value = e.response?.data?.message || 'Erreur lors du chargement des affectations'
  } finally {
    relatedLoading.value = false
  }
}

async function loadTeacher() {
  loading.value = true
  error.value = null
  try {
    const id = Number(route.params.id)
    if (!id || Number.isNaN(id)) {
      throw new Error('ID professeur invalide')
    }
    const response = await getTeacher(id)
    teacher.value = response
    if (teacher.value?.id) {
      await loadTeacherRelatedData(teacher.value.id)
    }
  } catch (e: any) {
    if (e?.response?.status === 404) {
      error.value = 'Enseignant non trouvé'
    } else if (e?.response?.status === 403) {
      error.value = 'Accès refusé à cet enseignant'
    } else {
      error.value = e?.message || e?.response?.data?.message || 'Erreur lors du chargement des informations de l\'enseignant'
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadTeacher)
</script>
