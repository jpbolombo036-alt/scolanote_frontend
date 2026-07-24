<template>
  <div v-if="visible" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
        <h2 class="text-lg font-extrabold text-slate-900 dark:text-white">{{ assignment ? 'Modifier' : 'Créer' }} une affectation</h2>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <!-- Informations générales -->
        <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <UserCheck class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Informations générales</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Professeur <span class="text-red-500">*</span></label>
              <div class="relative">
                <UserCheck class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select v-model="form.teacherId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                  <option value="">Sélectionner</option>
                  <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.nom }} {{ t.postnom }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Classe <span class="text-red-500">*</span></label>
              <div class="relative">
                <School class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select v-model="form.classroomId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                  <option value="">Sélectionner</option>
                  <option v-for="c in classrooms" :key="c.id" :value="c.id">{{ c.nom }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Matière <span class="text-red-500">*</span></label>
              <div class="relative">
                <BookOpen class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select v-model="form.subjectId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                  <option value="">Sélectionner</option>
                  <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.nom }}</option>
                </select>
              </div>
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
import { X, UserCheck, School, BookOpen, AlertCircle, Check } from 'lucide-vue-next'

const props = defineProps({
  assignment: Object,
  visible: Boolean
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref(null)
const teachers = ref([])
const classrooms = ref([])
const subjects = ref([])

const form = reactive({
  teacherId: '',
  classroomId: '',
  subjectId: ''
})

watch(() => props.assignment, (newAssignment) => {
  if (newAssignment) {
    Object.assign(form, newAssignment)
  } else {
    Object.assign(form, { teacherId: '', classroomId: '', subjectId: '' })
  }
}, { immediate: true })

onMounted(async () => {
  try {
    const [teachersRes, classroomsRes, subjectsRes] = await Promise.all([
      fetch('/api/enseignants').then(r => r.json()),
      fetch('/api/salles').then(r => r.json()),
      fetch('/api/matieres').then(r => r.json())
    ])
    teachers.value = teachersRes
    classrooms.value = classroomsRes
    subjects.value = subjectsRes
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