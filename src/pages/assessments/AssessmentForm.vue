<template>
  <div v-if="visible" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
        <h2 class="text-lg font-extrabold text-slate-900 dark:text-white">{{ assessment ? 'Modifier' : 'Créer' }} une évaluation</h2>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <!-- Informations générales -->
        <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <FileText class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Informations générales</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Affectation <span class="text-red-500">*</span></label>
              <select v-model="form.assignmentId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                <option value="">Sélectionner</option>
                <option v-for="a in assignments" :key="a.id" :value="a.id">{{ a.teacherId }} - {{ a.classroomId }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Type d'évaluation <span class="text-red-500">*</span></label>
              <select v-model="form.assessmentTypeId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                <option value="">Sélectionner</option>
                <option v-for="t in assessmentTypes" :key="t.id" :value="t.id">{{ t.nom }} (coeff: {{ t.coefficient }})</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Période <span class="text-red-500">*</span></label>
              <select v-model="form.periodId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                <option value="">Sélectionner</option>
                <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.nom }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Titre <span class="text-red-500">*</span></label>
              <input
                v-model="form.titre"
                type="text"
                required
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
              <input
                v-model="form.date"
                type="date"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Note maximale</label>
              <input
                v-model.number="form.noteMax"
                type="number"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div class="md:col-span-2 flex items-center gap-2">
              <input id="publie" v-model="form.publie" type="checkbox" class="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
              <label for="publie" class="text-xs font-medium text-slate-700 dark:text-slate-300">Publié</label>
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
import { X, FileText, AlertCircle, Check } from 'lucide-vue-next'

const props = defineProps({
  assessment: Object,
  visible: Boolean
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref(null)
const assignments = ref([])
const assessmentTypes = ref([])
const periods = ref([])

const form = reactive({
  assignmentId: '',
  assessmentTypeId: '',
  periodId: '',
  titre: '',
  date: '',
  noteMax: 20,
  publie: false
})

watch(() => props.assessment, (newAssessment) => {
  if (newAssessment) {
    Object.assign(form, newAssessment)
  } else {
    Object.assign(form, { assignmentId: '', assessmentTypeId: '', periodId: '', titre: '', date: '', noteMax: 20, publie: false })
  }
}, { immediate: true })

onMounted(async () => {
  try {
    const [assignmentsRes, typesRes, periodsRes] = await Promise.all([
      fetch('/api/attributions-enseignement').then(r => r.json()),
      fetch('/api/types-evaluations').then(r => r.json()),
      fetch('/api/periodes').then(r => r.json())
    ])
    assignments.value = assignmentsRes
    assessmentTypes.value = typesRes
    periods.value = Array.isArray(periodsRes) ? periodsRes : (periodsRes.content || [])
  } catch (e) {
    console.error('Erreur lors du chargement', e)
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  try {
    await emit('save', { ...form })
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    saving.value = false
  }
}
</script>