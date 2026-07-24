<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ isEdit ? 'Modifier' : 'Créer' }} une classe</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accueil / Classes / {{ isEdit ? 'Modifier' : 'Nouvelle classe' }}</p>
      </div>
      <button @click="$router.back()" class="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Retour</button>
    </div>

    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 md:p-8 max-w-3xl">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nom <span class="text-red-500">*</span></label>
            <input v-model="form.nom" type="text" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Année scolaire <span class="text-red-500">*</span></label>
            <select v-model="form.academicYearId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option v-for="year in academicYears" :key="year.id" :value="year.id">{{ year.libelle }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Niveau <span class="text-red-500">*</span></label>
            <select v-model="form.levelId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option v-for="level in levels" :key="level.id" :value="level.id">{{ level.nom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Section <span class="text-red-500">*</span></label>
            <select v-model="form.sectionId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option v-for="section in sections" :key="section.id" :value="section.id">{{ section.nom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Option</label>
            <select v-model="form.optionId" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option v-for="option in options" :key="option.id" :value="option.id">{{ option.nom }}</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button type="button" @click="$router.back()" class="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Annuler</button>
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
const saving = ref(false)
const error = ref(null)
const academicYears = ref([])
const levels = ref([])
const sections = ref([])
const options = ref([])

const form = reactive({
  nom: '',
  academicYearId: null,
  levelId: null,
  sectionId: null,
  optionId: null
})

onMounted(async () => {
  try {
    const [yearsRes, levelsRes, sectionsRes, optionsRes, classRes] = await Promise.all([
      api.get('/api/annees-academiques').then(r => r.data),
      api.get('/api/niveaux').then(r => r.data),
      api.get('/api/sections').then(r => r.data),
      api.get('/api/options').then(r => r.data),
      isEdit ? api.get(`/api/salles/${route.params.id}`).then(r => r.data) : Promise.resolve(null)
    ])
    academicYears.value = Array.isArray(yearsRes) ? yearsRes : (yearsRes.content || [])
    levels.value = Array.isArray(levelsRes) ? levelsRes : (levelsRes.content || [])
    sections.value = Array.isArray(sectionsRes) ? sectionsRes : (sectionsRes.content || [])
    options.value = Array.isArray(optionsRes) ? optionsRes : (optionsRes.content || [])
    if (classRes) {
      Object.assign(form, {
        nom: classRes.nom || '',
        academicYearId: classRes.academicYearId || classRes.academicYear?.id || null,
        levelId: classRes.levelId || classRes.level?.id || null,
        sectionId: classRes.sectionId || classRes.section?.id || null,
        optionId: classRes.optionId || classRes.option?.id || null
      })
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement'
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  try {
    if (isEdit) {
      await api.put(`/api/salles/${route.params.id}`, form)
    } else {
      await api.post('/api/salles', form)
    }
    router.push('/salles')
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}
</script>