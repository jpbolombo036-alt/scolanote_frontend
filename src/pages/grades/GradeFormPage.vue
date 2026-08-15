<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ isEdit ? 'Modifier' : 'Créer' }} une note</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accueil / Notes / {{ isEdit ? 'Modifier' : 'Nouvelle note' }}</p>
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
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Évaluation <span class="text-red-500">*</span></label>
            <select v-model="form.assessmentId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option v-for="a in assessments" :key="a.id" :value="a.id">{{ a.titre }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Élève <span class="text-red-500">*</span>
              <span v-if="!isEdit" class="font-normal text-slate-400">(reste à noter)</span>
            </label>
            <select v-model="form.studentId" required :disabled="!isEdit && !form.assessmentId" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="">{{ studentPlaceholder }}</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ formatStudent(s) }}</option>
            </select>
            <p v-if="!isEdit && form.assessmentId && !loadingStudents && !students.length" class="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              ✅ Tous les élèves de la classe sont déjà notés pour cette évaluation
            </p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Note /{{ noteMax }}</label>
            <input v-model.number="form.note" type="number" step="0.01" min="0" :max="noteMax" :disabled="form.absence" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Observation</label>
            <input v-model="form.observation" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div class="md:col-span-2 flex items-center gap-2">
            <input id="absence" v-model="form.absence" type="checkbox" @change="onAbsenceChange" class="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
            <label for="absence" class="text-xs font-medium text-slate-700 dark:text-slate-300">Absent <span class="text-slate-400">(la note sera vidée — un absent ne peut pas avoir de note)</span></label>
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'
import { getStudentsWithoutGrade } from '@/api/grades'
import { AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isEdit = !!route.params.id
const saving = ref(false)
const error = ref(null)
const assessments = ref([])
const students = ref([])
const loadingStudents = ref(false)

const form = reactive({
  assessmentId: '',
  studentId: '',
  note: null,
  absence: false,
  observation: ''
})

// Évaluation sélectionnée → barème dynamique (noteMax côté serveur)
const selectedAssessment = computed(() =>
  assessments.value.find(a => a.id === Number(form.assessmentId)) || null
)
const noteMax = computed(() => selectedAssessment.value?.noteMax ?? 20)

const studentPlaceholder = computed(() => {
  if (isEdit) return 'Sélectionner'
  if (!form.assessmentId) return "Sélectionnez d'abord une évaluation"
  if (loadingStudents.value) return 'Chargement des élèves...'
  return 'Sélectionner'
})

function formatStudent(s) {
  const parts = [s.nom, s.postnom, s.prenom].filter(Boolean).join(' ')
  return s.numeroOrdre ? `${s.numeroOrdre}. ${parts}` : parts
}

/** Règle backend : un élève marqué absent ne peut pas avoir de note. */
function onAbsenceChange() {
  if (form.absence) form.note = null
}

/**
 * En création : ne charge que les élèves PAS ENCORE notés pour l'évaluation
 * (endpoint dédié). Un élève déjà noté — ou marqué absent — disparaît de la liste.
 */
async function loadStudentsToGrade(assessmentId) {
  if (!assessmentId) {
    students.value = []
    return
  }
  loadingStudents.value = true
  try {
    const data = await getStudentsWithoutGrade(Number(assessmentId))
    // Adaptation au format du select (id / nom / postnom / prenom)
    students.value = data.map(m => ({
      id: m.studentId,
      matricule: m.matricule,
      nom: m.nom,
      postnom: m.postnom,
      prenom: m.prenom,
      numeroOrdre: m.numeroOrdre
    }))
    // Si l'élève choisi a été noté entre-temps (ex: par un collègue), on le retire
    if (form.studentId && !students.value.some(s => s.id === Number(form.studentId))) {
      form.studentId = ''
    }
  } catch (e) {
    error.value = e.response?.data?.error || 'Erreur lors du chargement des élèves à noter'
  } finally {
    loadingStudents.value = false
  }
}

watch(() => form.assessmentId, (newVal) => {
  if (!isEdit) loadStudentsToGrade(newVal)
})

onMounted(async () => {
  try {
    if (isEdit) {
      // En édition, l'élève courant a déjà une note → liste complète nécessaire
      const [assessmentsRes, studentsRes, gradeRes] = await Promise.all([
        api.get('/api/evaluations').then(r => r.data),
        api.get('/api/eleves').then(r => r.data),
        api.get(`/api/notes/${route.params.id}`).then(r => r.data)
      ])
      assessments.value = assessmentsRes
      students.value = Array.isArray(studentsRes) ? studentsRes : (studentsRes.content || [])
      if (gradeRes) {
        Object.assign(form, gradeRes)
      }
    } else {
      // En création, les élèves « reste à noter » sont chargés à la sélection de l'évaluation
      assessments.value = await api.get('/api/evaluations').then(r => r.data)
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement'
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null

  // Règle backend : un élève absent ne peut pas avoir de note
  if (form.absence) {
    form.note = null
  } else if (form.note !== null && form.note !== undefined && form.note !== '') {
    if (Number(form.note) < 0 || Number(form.note) > noteMax.value) {
      error.value = `La note doit être comprise entre 0 et ${noteMax.value}`
      saving.value = false
      return
    }
  }

  try {
    const payload = { ...form }
    if (isEdit) {
      await api.put(`/api/notes/${route.params.id}`, payload)
    } else {
      await api.post('/api/notes', payload)
    }
    router.push('/notes')
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
    // 409 : l'élève a déjà été noté (ex: par un collègue) → rafraîchir la liste des « reste à noter »
    if (e.response?.status === 409 && !isEdit) {
      await loadStudentsToGrade(form.assessmentId)
    }
  } finally {
    saving.value = false
  }
}
</script>