<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ isEdit ? 'Modifier' : 'Créer' }} une classe</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accueil / Classes / {{ isEdit ? 'Modifier' : 'Nouvelle classe' }}</p>
      </div>
      <button @click="$router.push('/salles')" class="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Retour</button>
    </div>

    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <div v-if="loading" class="py-16 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent"></div>
      <p class="text-xs text-slate-400 font-medium mt-3">Chargement du formulaire...</p>
    </div>

    <div v-else class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 md:p-8 max-w-3xl">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nom <span class="text-red-500">*</span></label>
            <input v-model="form.nom" type="text" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-brand-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Année scolaire <span class="text-red-500">*</span></label>
            <select v-model="form.academicYearId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-brand-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option v-for="year in academicYears" :key="year.id" :value="year.id">{{ year.libelle }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Niveau <span class="text-red-500">*</span></label>
            <select v-model="form.levelId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-brand-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option v-for="level in levels" :key="level.id" :value="level.id">{{ level.nom }}</option>
            </select>
          </div>
          <div v-if="sections.length">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Section <span class="text-red-500">*</span></label>
            <select v-model="form.sectionId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-brand-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option v-for="section in sections" :key="section.id" :value="section.id">{{ section.nom }}</option>
            </select>
          </div>
          <div v-if="options.length">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Option</label>
            <select v-model="form.optionId" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-brand-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option v-for="option in options" :key="option.id" :value="option.id">{{ option.nom }}</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button type="button" @click="$router.push('/salles')" class="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Annuler</button>
          <button type="submit" :disabled="saving" class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/25 transition disabled:opacity-50">
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'
import { AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isEdit = !!route.params.id
const loading = ref(true)
const saving = ref(false)
const error = ref(null)
const academicYears = ref([])
const levels = ref([])
const sections = ref([])
const options = ref([])

const form = reactive({
  nom: '',
  academicYearId: '',
  levelId: '',
  sectionId: '',
  optionId: ''
})

function parseList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  return []
}

function buildPayload() {
  const payload = {
    nom: form.nom.trim(),
    academicYearId: Number(form.academicYearId),
    levelId: Number(form.levelId),
  }
  if (form.sectionId) payload.sectionId = Number(form.sectionId)
  if (form.optionId) payload.optionId = Number(form.optionId)
  return payload
}

onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    const requests = [
      api.get('/api/annees-academiques'),
      api.get('/api/niveaux'),
      api.get('/api/sections'),
      api.get('/api/options')
    ]
    if (isEdit) requests.push(api.get(`/api/salles/${route.params.id}`))

    const results = await Promise.allSettled(requests)
    const [yearsRes, levelsRes, sectionsRes, optionsRes, classRes] = results

    if (yearsRes.status === 'fulfilled') {
      academicYears.value = parseList(yearsRes.value.data)
    } else {
      throw new Error('Impossible de charger les années scolaires')
    }

    if (levelsRes.status === 'fulfilled') {
      levels.value = parseList(levelsRes.value.data)
    } else {
      throw new Error('Impossible de charger les niveaux')
    }

    if (sectionsRes.status === 'fulfilled') {
      sections.value = parseList(sectionsRes.value.data)
    }

    if (optionsRes.status === 'fulfilled') {
      options.value = parseList(optionsRes.value.data)
    }

    if (isEdit) {
      if (classRes?.status !== 'fulfilled') {
        throw new Error('Impossible de charger la classe')
      }
      const classData = classRes.value.data
      Object.assign(form, {
        nom: classData.nom || '',
        academicYearId: classData.academicYearId || classData.academicYear?.id || '',
        levelId: classData.levelId || classData.level?.id || '',
        sectionId: classData.sectionId || classData.section?.id || '',
        optionId: classData.optionId || classData.option?.id || ''
      })
    }
  } catch (e) {
    error.value = e.message || e.response?.data?.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  try {
    const payload = buildPayload()
    if (isEdit) {
      await api.put(`/api/salles/${route.params.id}`, payload)
    } else {
      await api.post('/api/salles', payload)
    }
    router.push('/salles')
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}
</script>
