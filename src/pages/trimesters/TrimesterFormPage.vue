<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ isEdit ? 'Modifier' : 'Créer' }} un trimestre</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accueil / Trimestres / {{ isEdit ? 'Modifier' : 'Nouveau trimestre' }}</p>
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
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Année scolaire <span class="text-red-500">*</span></label>
            <select v-model="form.academicYearId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option v-for="year in academicYears" :key="year.id" :value="year.id">{{ year.libelle }}</option>
            </select>
          </div>
            <div>
             <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Ordre <span class="text-slate-400 text-[10px]">(serveur)</span></label>
             <div class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium flex items-center gap-2">
               <Hash class="w-4 h-4 text-slate-400 shrink-0" />
               <span class="text-slate-400">Attribué automatiquement par le serveur</span>
             </div>
           </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date fin</label>
            <input v-model="form.dateFin" type="date" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
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
import { AlertCircle, Hash } from 'lucide-vue-next'
import { useNumeroOrdre } from '@/composables/useNumeroOrdre'

const route = useRoute()
const router = useRouter()
const { cleanPayload } = useNumeroOrdre()

const isEdit = !!route.params.id
const saving = ref(false)
const error = ref(null)
const academicYears = ref([])

const form = reactive({
  academicYearId: '',
  nom: '',
  dateDebut: '',
  dateFin: ''
})

onMounted(async () => {
  try {
    const [yearsRes, trimesterRes] = await Promise.all([
      api.get('/api/annees-academiques').then(r => r.data),
      isEdit ? api.get(`/api/trimestres/${route.params.id}`).then(r => r.data) : Promise.resolve(null)
    ])
    academicYears.value = Array.isArray(yearsRes) ? yearsRes : (yearsRes.content || [])
    if (trimesterRes) {
      Object.assign(form, trimesterRes)
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement'
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  try {
    const payload = cleanPayload({ ...form })
    if (isEdit) {
      await api.put(`/api/trimestres/${route.params.id}`, payload)
    } else {
      await api.post('/api/trimestres', payload)
    }
    router.push('/trimestres')
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  } finally {
    saving.value = false
  }
}
</script>