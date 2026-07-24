<template>
  <div v-if="visible" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 class="text-lg font-extrabold text-slate-900 dark:text-white">Nouveau bulletin</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Accueil / Bulletins / Ajouter un bulletin</p>
        </div>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <!-- Informations générales -->
        <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <User class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Informations générales</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Élève *</label>
              <div class="relative">
                <User class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select v-model="form.studentId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                  <option value="">Sélectionner</option>
                  <option v-for="s in students" :key="s.id" :value="s.id">{{ s.nom }} {{ s.postnom }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Classe *</label>
              <div class="relative">
                <School class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select v-model="form.classroomId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                  <option value="">Sélectionner</option>
                  <option v-for="c in classrooms" :key="c.id" :value="c.id">{{ c.nom }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Année scolaire *</label>
              <div class="relative">
                <Calendar class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select v-model="form.academicYearId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                  <option value="">Sélectionner</option>
                  <option v-for="y in academicYears" :key="y.id" :value="y.id">{{ y.libelle }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Trimestre *</label>
              <div class="relative">
                <Clock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select v-model="form.trimesterId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                  <option value="">Sélectionner</option>
                  <option v-for="t in trimesters" :key="t.id" :value="t.id">{{ t.nom }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes par matière -->
        <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <BookOpen class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Notes par matière</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th class="px-4 py-3">Matière</th>
                  <th class="px-4 py-3">Coefficient</th>
                  <th class="px-4 py-3">Note /20</th>
                  <th class="px-4 py-3">Note pondérée</th>
                  <th class="px-4 py-3">Appréciation</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">
                <tr v-for="subject in subjects" :key="subject.id">
                  <td class="px-4 py-3 font-bold text-slate-900 dark:text-white">{{ subject.nom }}</td>
                  <td class="px-4 py-3">{{ subject.coefficient }}</td>
                  <td class="px-4 py-3">
                    <input v-model="subject.grade" type="number" step="0.01" min="0" max="20" class="w-20 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center bg-white dark:bg-[#0d1527] text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition" />
                  </td>
                  <td class="px-4 py-3 font-bold" :class="getGradeColor(subject.grade)">{{ getWeightedGrade(subject.grade, subject.coefficient) }}</td>
                  <td class="px-4 py-3">
                    <select v-model="subject.appreciation" class="border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs bg-white dark:bg-[#0d1527] text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition">
                      <option value="">-</option>
                      <option value="Tres Bien">Très Bien</option>
                      <option value="Bien">Bien</option>
                      <option value="Assez Bien">Assez Bien</option>
                      <option value="Passable">Passable</option>
                      <option value="Insuffisant">Insuffisant</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 rounded-xl px-4 py-3 text-xs font-medium">
            <Info class="w-4 h-4 shrink-0 mt-0.5" />
            <span>Saisissez les notes sur 20. Les notes pondérées sont calculées automatiquement.</span>
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
          <div class="flex w-full sm:w-auto gap-2">
            <button type="button" :disabled="saving" class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-brand-500 text-brand-600 rounded-xl text-xs font-semibold hover:bg-brand-50 transition disabled:opacity-50">
              <FileText class="w-4 h-4" />
              Enregistrer le brouillon
            </button>
            <button type="submit" :disabled="saving" class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/25 transition disabled:opacity-50">
              <Check class="w-4 h-4" />
              {{ saving ? 'Enregistrement...' : 'Enregistrer le bulletin' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { X, User, School, Calendar, Clock, BookOpen, Info, AlertCircle, FileText, Check } from 'lucide-vue-next'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref(null)
const classrooms = ref([])
const periods = ref([])
const academicYears = ref([])
const trimesters = ref([])
const students = ref([])
const subjects = ref([])

const form = reactive({
  studentId: '',
  classroomId: '',
  academicYearId: '',
  trimesterId: ''
})

const getWeightedGrade = (grade, coefficient) => {
  const g = Number(grade)
  if (!Number.isFinite(g)) return '-'
  const c = Number(coefficient) || 0
  return (g * c).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getGradeColor = (grade) => {
  const g = Number(grade)
  if (!Number.isFinite(g)) return 'text-slate-500'
  if (g >= 14) return 'text-emerald-600'
  if (g >= 10) return 'text-amber-600'
  return 'text-red-500'
}

onMounted(async () => {
  try {
    const [classroomsRes, periodsRes, yearsRes, trimestersRes, studentsRes] = await Promise.all([
      fetch('/api/salles').then(r => r.json()),
      fetch('/api/periodes').then(r => r.json()),
      fetch('/api/annees-academiques').then(r => r.json()),
      fetch('/api/trimestres').then(r => r.json()),
      fetch('/api/eleves').then(r => r.json())
    ])
    classrooms.value = Array.isArray(classroomsRes) ? classroomsRes : (classroomsRes.content || [])
    periods.value = Array.isArray(periodsRes) ? periodsRes : (periodsRes.content || [])
    academicYears.value = Array.isArray(yearsRes) ? yearsRes : (yearsRes.content || [])
    trimesters.value = Array.isArray(trimestersRes) ? trimestersRes : (trimestersRes.content || [])
    students.value = Array.isArray(studentsRes) ? studentsRes : (studentsRes.content || [])

    subjects.value = [
      { id: 1, nom: 'Français', coefficient: 2, grade: '', appreciation: '' },
      { id: 2, nom: 'Mathématiques', coefficient: 3, grade: '', appreciation: '' },
      { id: 3, nom: 'Anglais', coefficient: 2, grade: '', appreciation: '' },
      { id: 4, nom: 'Histoire-Géographie', coefficient: 2, grade: '', appreciation: '' },
      { id: 5, nom: 'Sciences de la vie', coefficient: 2, grade: '', appreciation: '' },
      { id: 6, nom: 'Physique-Chimie', coefficient: 2, grade: '', appreciation: '' },
      { id: 7, nom: 'Éducation Civique', coefficient: 1, grade: '', appreciation: '' },
      { id: 8, nom: 'EPS', coefficient: 1, grade: '', appreciation: '' }
    ]
  } catch (e) {
    console.error('Erreur lors du chargement', e)
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  try {
    await emit('save', {
      ...form,
      subjects: subjects.value
    })
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    saving.value = false
  }
}
</script>
