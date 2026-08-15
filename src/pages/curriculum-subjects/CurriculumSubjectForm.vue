<template>
  <div v-if="visible" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
        <h2 class="text-lg font-extrabold text-slate-900 dark:text-white">{{ curriculumSubject ? 'Modifier' : 'Créer' }} une matière de programme</h2>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <BookOpen class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Informations générales</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Programme <span class="text-red-500">*</span></label>
              <div class="relative">
                <BookOpen class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select v-model="form.curriculumId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                  <option value="">Sélectionner</option>
                  <option v-for="c in curriculums" :key="c.id" :value="c.id">{{ c.nom }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Matière <span class="text-red-500">*</span></label>
              <div class="relative">
                <List class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select v-model="form.subjectId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                  <option value="">Sélectionner</option>
                  <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.nom }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Coefficient</label>
              <input v-model.number="form.coefficient" type="number" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Ordre <span class="text-slate-400 text-[10px]">(serveur)</span></label>
              <div class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium flex items-center gap-2">
                <Hash class="w-4 h-4 text-slate-400 shrink-0" />
                <span class="text-slate-400">Attribué automatiquement par le serveur</span>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Obligatoire</label>
              <select v-model="form.obligatoire" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                <option :value="true">Oui</option>
                <option :value="false">Non</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
          <AlertCircle class="w-5 h-5 shrink-0" />
          <span>{{ error }}</span>
        </div>

        <!-- Sticky bottom bar -->
        <div class="sticky bottom-0 bg-white/90 dark:bg-[#0d1527]/90 backdrop-blur border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 -mx-6 -mb-5">
          <button type="button" @click="$emit('close')" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <X class="w-4 h-4" />
            Annuler
          </button>
          <button type="submit" :disabled="saving" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/25 transition disabled:opacity-50">
            <Check class="w-4 h-4" />
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { X, BookOpen, List, AlertCircle, Check, Hash } from 'lucide-vue-next'
import api from '@/api/axios'

const props = defineProps({
  curriculumSubject: Object,
  visible: Boolean
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref(null)
const curriculums = ref([])
const subjects = ref([])

const form = reactive({
  curriculumId: null,
  subjectId: null,
  coefficient: null,
  obligatoire: false
})

watch(() => props.curriculumSubject, (newCs) => {
  if (newCs) {
    Object.assign(form, newCs)
  } else {
    Object.assign(form, { curriculumId: null, subjectId: null, coefficient: null, obligatoire: false })
  }
}, { immediate: true })

onMounted(async () => {
  try {
    const [curriculumsRes, subjectsRes] = await Promise.all([
      api.get('/api/programmes'),
      api.get('/api/matieres')
    ])
    curriculums.value = Array.isArray(curriculumsRes.data) ? curriculumsRes.data : (curriculumsRes.data.content || [])
    subjects.value = Array.isArray(subjectsRes.data) ? subjectsRes.data : (subjectsRes.data.content || [])
  } catch (e) {
    console.error('Erreur lors du chargement des listes déroulantes', e)
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  try {
    const payload = { ...form }
    await emit('save', payload)
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    saving.value = false
  }
}
</script>