<template>
  <div v-if="visible" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
        <h2 class="text-lg font-extrabold text-slate-900 dark:text-white">{{ period ? 'Modifier' : 'Créer' }} une période</h2>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="px-6 py-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80">
        <button v-if="period" type="button" @click="onLock" :disabled="lockLoading" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50">
          <Lock class="w-3.5 h-3.5" />
          Verrouiller
        </button>
        <button v-if="period" type="button" @click="onUnlock" :disabled="lockLoading" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">
          <Unlock class="w-3.5 h-3.5" />
          Déverrouiller
        </button>
        <button v-if="period" type="button" @click="onValidate" :disabled="validateLoading" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50">
          <Check class="w-3.5 h-3.5" />
          Valider la clôture
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Clock class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Informations générales</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nom <span class="text-red-500">*</span></label>
              <input
                v-model="form.nom"
                type="text"
                required
                placeholder="Ex: Période 1"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Trimestre <span class="text-red-500">*</span></label>
              <div class="relative">
                <Calendar class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select v-model="form.trimesterId" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
                  <option value="">Sélectionner</option>
                  <option v-for="t in trimesters" :key="t.id" :value="t.id">{{ t.nom }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Type</label>
              <select
                v-model="form.type"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none"
              >
                <option value="">Sélectionner</option>
                <option value="PERIODE">Période</option>
                <option value="EXAMEN">Examen</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Ordre <span class="text-slate-400 text-[10px]">(serveur)</span></label>
              <div class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium flex items-center gap-2">
                <Hash class="w-4 h-4 text-slate-400 shrink-0" />
                <span class="text-slate-400">Attribué automatiquement par le serveur</span>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date début</label>
              <input v-model="form.dateDebut" type="date" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date fin</label>
              <input v-model="form.dateFin" type="date" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
            </div>
          </div>
        </div>

        <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
          <AlertCircle class="w-5 h-5 shrink-0" />
          <span>{{ error }}</span>
        </div>

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
import { X, Clock, Calendar, AlertCircle, Check, Lock, Unlock, Hash } from 'lucide-vue-next'
import api from '@/api/axios'
import { useNumeroOrdre } from '@/composables/useNumeroOrdre'

const props = defineProps({
  period: Object,
  visible: Boolean
})

const emit = defineEmits(['close', 'save'])

const { cleanPayload } = useNumeroOrdre()

const saving = ref(false)
const lockLoading = ref(false)
const validateLoading = ref(false)
const error = ref(null)
const trimesters = ref([])

const form = reactive({
  nom: '',
  trimesterId: null,
  type: '',
  dateDebut: '',
  dateFin: ''
})

watch(() => props.period, (newPeriod) => {
  if (newPeriod) {
    Object.assign(form, {
      nom: newPeriod.nom || '',
      trimesterId: newPeriod.trimesterId || newPeriod.trimester?.id || null,
      type: newPeriod.type || '',
      dateDebut: newPeriod.dateDebut || '',
      dateFin: newPeriod.dateFin || ''
    })
  } else {
    Object.assign(form, { nom: '', trimesterId: null, type: '', dateDebut: '', dateFin: '' })
  }
}, { immediate: true })

onMounted(async () => {
  try {
    const response = await fetch('/api/trimestres')
    const data = await response.json()
    trimesters.value = Array.isArray(data) ? data : (data.content || [])
  } catch (e) {
    console.error('Erreur lors du chargement des trimestres', e)
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  try {
    const payload = cleanPayload({ ...form })
    await emit('save', payload)
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}

async function onLock() {
  if (!props.period?.id) return
  lockLoading.value = true
  error.value = null
  try {
    await api.post(`/api/periodes/${props.period.id}/verrouiller`)
    error.value = null
    emit('save', cleanPayload({ ...form }))
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du verrouillage'
  } finally {
    lockLoading.value = false
  }
}

async function onUnlock() {
  if (!props.period?.id) return
  lockLoading.value = true
  error.value = null
  try {
    await api.post(`/api/periodes/${props.period.id}/deverrouiller`)
    error.value = null
    emit('save', cleanPayload({ ...form }))
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors du déverrouillage'
  } finally {
    lockLoading.value = false
  }
}

async function onValidate() {
  if (!props.period?.id) return
  validateLoading.value = true
  error.value = null
  try {
    await api.get(`/api/periodes/${props.period.id}/valider`)
    error.value = null
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la validation'
  } finally {
    validateLoading.value = false
  }
}
</script>