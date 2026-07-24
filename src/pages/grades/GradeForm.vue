<template>
  <div v-if="visible" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
        <h2 class="text-lg font-extrabold text-slate-900 dark:text-white">{{ grade ? 'Modifier' : 'Créer' }} une note</h2>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <!-- Informations générales -->
        <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <BookOpen class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Informations générales</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Évaluation <span class="text-red-500">*</span></label>
              <div class="relative">
                <FileText class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select v-model="form.assessmentId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                  <option value="">Sélectionner</option>
                  <option v-for="a in assessments" :key="a.id" :value="a.id">{{ a.titre }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Élève <span class="text-red-500">*</span></label>
              <div class="relative">
                <Users class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select v-model="form.studentId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                  <option value="">Sélectionner</option>
                  <option v-for="s in students" :key="s.id" :value="s.id">{{ s.nom }} {{ s.postnom }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Note /20</label>
              <input v-model.number="form.note" type="number" step="0.01" min="0" max="20" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Observation</label>
              <input v-model="form.observation" type="text" placeholder="Observation..." class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
            </div>
            <div class="md:col-span-2 flex items-center gap-2">
              <input id="absence" v-model="form.absence" type="checkbox" class="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
              <label for="absence" class="text-xs font-medium text-slate-700 dark:text-slate-300">Absent</label>
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
import { X, BookOpen, FileText, Users, AlertCircle, Check } from 'lucide-vue-next'

const props = defineProps({
  grade: Object,
  visible: Boolean
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref(null)
const assessments = ref([])
const students = ref([])

const form = reactive({
  assessmentId: '',
  studentId: '',
  note: null,
  absence: false,
  observation: ''
})

watch(() => props.grade, (newGrade) => {
  if (newGrade) {
    Object.assign(form, newGrade)
  } else {
    Object.assign(form, { assessmentId: '', studentId: '', note: null, absence: false, observation: '' })
  }
}, { immediate: true })

onMounted(async () => {
  try {
    const [assessmentsRes, studentsRes] = await Promise.all([
      fetch('/api/evaluations').then(r => r.json()),
      fetch('/api/eleves').then(r => r.json())
    ])
    assessments.value = assessmentsRes
    students.value = studentsRes
  } catch (e) {
    console.error('Erreur lors du chargement', e)
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  
  if (!form.assessmentId) {
    error.value = 'Veuillez sélectionner une évaluation'
    saving.value = false
    return
  }
  if (!form.studentId) {
    error.value = 'Veuillez sélectionner un élève'
    saving.value = false
    return
  }
  if (form.note === null || form.note === undefined || form.note === '') {
    error.value = 'Veuillez entrer une note'
    saving.value = false
    return
  }
  if (Number(form.note) < 0 || Number(form.note) > 20) {
    error.value = 'La note doit être comprise entre 0 et 20'
    saving.value = false
    return
  }
  
  try {
    await emit('save', { ...form })
  } catch (e) {
    error.value = e.response?.data?.message || e.response?.data?.error || 'Erreur lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}
</script>