<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Générer un bulletin</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accueil / Bulletins / Générer un bulletin</p>
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
             <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Classe <span class="text-red-500">*</span></label>
             <select v-model="form.classroomId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
               <option value="">Sélectionner</option>
               <option v-for="c in classrooms" :key="c.id" :value="c.id">{{ c.nom }}</option>
             </select>
           </div>
           <div>
             <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Période <span class="text-red-500">*</span></label>
             <select v-model="form.periodId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
               <option value="">Sélectionner</option>
               <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.nom }}</option>
             </select>
           </div>
         </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button type="button" @click="$router.back()" class="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Annuler</button>
          <button type="submit" :disabled="saving" class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/25 transition disabled:opacity-50">
            {{ saving ? 'Génération...' : 'Générer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { generateBulletins } from '@/api/report-cards'
import { AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const saving = ref(false)
const error = ref(null)
const classrooms = ref([])
const periods = ref([])

const form = reactive({
  classroomId: '',
  periodId: ''
})

onMounted(async () => {
  try {
    const [classroomsRes, periodsRes] = await Promise.all([
      api.get('/api/salles').then(r => r.data),
      api.get('/api/periodes').then(r => r.data)
    ])
    classrooms.value = Array.isArray(classroomsRes) ? classroomsRes : (classroomsRes.content || [])
    periods.value = Array.isArray(periodsRes) ? periodsRes : (periodsRes.content || [])
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement'
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  try {
    const payload = {
      classroomId: Number(form.classroomId),
      periodId: Number(form.periodId)
    }

    if (!payload.classroomId || !payload.periodId) {
      throw new Error('Veuillez sélectionner une classe et une période valides.')
    }

    await generateBulletins(payload)
    router.push('/bulletins')
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || e.message || 'Erreur serveur'
  } finally {
    saving.value = false
  }
}
</script>