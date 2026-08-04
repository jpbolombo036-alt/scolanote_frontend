<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ isEdit ? 'Modifier' : 'Créer' }} une présence</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accueil / Présences / {{ isEdit ? 'Modifier' : 'Nouvelle présence' }}</p>
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
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Élève <span class="text-red-500">*</span></label>
            <select v-model="form.studentId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.nom }} {{ s.postnom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Période <span class="text-red-500">*</span></label>
            <select v-model="form.periodId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.nom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date <span class="text-red-500">*</span></label>
            <input v-model="form.date" type="date" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Motif</label>
            <input v-model="form.motif" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div class="md:col-span-2 flex flex-wrap items-center gap-4">
            <label class="inline-flex items-center gap-2">
              <input v-model="form.retard" type="checkbox" class="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300">Retard</span>
            </label>
            <label class="inline-flex items-center gap-2">
              <input v-model="form.absence" type="checkbox" class="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300">Absence</span>
            </label>
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
const students = ref([])
const periods = ref([])

const form = reactive({
  studentId: '',
  periodId: '',
  date: '',
  retard: false,
  absence: false,
  motif: ''
})

onMounted(async () => {
  try {
    const [studentsRes, periodsRes, attendanceRes] = await Promise.all([
      api.get('/api/eleves').then(r => r.data),
      api.get('/api/periodes').then(r => r.data),
      isEdit ? api.get(`/api/presences/${route.params.id}`).then(r => r.data) : Promise.resolve(null)
    ])
    students.value = Array.isArray(studentsRes) ? studentsRes : (studentsRes.content || [])
    periods.value = Array.isArray(periodsRes) ? periodsRes : (periodsRes.content || [])
    if (attendanceRes) {
      Object.assign(form, attendanceRes)
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement'
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  try {
    const payload = { ...form }
    if (isEdit) {
      await api.put(`/api/presences/${route.params.id}`, payload)
    } else {
      await api.post('/api/presences', payload)
    }
    router.push('/presences')
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  } finally {
    saving.value = false
  }
}
</script>