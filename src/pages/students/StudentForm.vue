<template>
  <div v-if="visible" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
        <h2 class="text-lg font-extrabold text-slate-900 dark:text-white">{{ student ? 'Modifier' : 'Créer' }} un élève</h2>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <!-- Informations générales -->
        <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Users class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Informations générales</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Matricule <span class="text-slate-400 text-[10px]">(laisser vide pour générer automatiquement)</span></label>
              <input
                v-model="form.matricule"
                type="text"
                placeholder="Ex: ELE-2026-001"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nom <span class="text-red-500">*</span></label>
              <input
                v-model="form.nom"
                type="text"
                required
                placeholder="Ex: Kasongo"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Postnom</label>
              <input
                v-model="form.postnom"
                type="text"
                placeholder="Ex: Mukendi"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Prénom</label>
              <input
                v-model="form.prenom"
                type="text"
                placeholder="Ex: Jean"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Sexe</label>
              <select
                v-model="form.sexe"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none"
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date de naissance</label>
              <input
                v-model="form.dateNaissance"
                type="date"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Lieu de naissance</label>
              <input
                v-model="form.lieuNaissance"
                type="text"
                placeholder="Ex: Kinshasa"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        <!-- Contact -->
        <div class="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Phone class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Contact</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nom du parent <span class="text-slate-400 text-[10px]">(pour le compte PARENT)</span></label>
              <input
                v-model="form.nomParent"
                type="text"
                placeholder="Nom du parent..."
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Postnom parent</label>
              <input
                v-model="form.postnomParent"
                type="text"
                placeholder="Postnom du parent..."
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Prénom parent</label>
              <input
                v-model="form.prenomParent"
                type="text"
                placeholder="Prénom du parent..."
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Téléphone parent</label>
              <input
                v-model="form.telephoneParent"
                type="text"
                placeholder="+243..."
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email parent</label>
              <input
                v-model="form.emailParent"
                type="email"
                placeholder="parent@exemple.com"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-lg px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Adresse</label>
              <input
                v-model="form.adresse"
                type="text"
                placeholder="Adresse résidentielle..."
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
          <AlertCircle class="w-5 h-5 shrink-0" />
          <span>{{ error }}</span>
        </div>

        <!-- Sticky bottom bar -->
        <div class="sticky bottom-0 bg-white/90 dark:bg-[#0d1527]/90 backdrop-blur border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 -mx-6 -mb-5">
          <button type="button" @click="$emit('close')" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <X class="w-4 h-4" />
            Annuler
          </button>
          <button type="submit" :disabled="saving" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-brand-500/25 transition disabled:opacity-50">
            <Check class="w-4 h-4" />
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { X, Users, Phone, AlertCircle, Check } from 'lucide-vue-next'

const props = defineProps({
  student: Object,
  visible: Boolean
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref(null)

const form = reactive({
  matricule: '',
  nom: '',
  postnom: '',
  prenom: '',
  sexe: '',
  dateNaissance: '',
  lieuNaissance: '',
  adresse: '',
  telephoneParent: '',
  emailParent: '',
  nomParent: '',
  postnomParent: '',
  prenomParent: '',
  etat: 'actif'
})

watch(() => props.student, (newStudent) => {
  if (newStudent) {
    Object.assign(form, newStudent)
  } else {
    Object.assign(form, {
      matricule: '',
      nom: '',
      postnom: '',
      prenom: '',
      sexe: '',
      dateNaissance: '',
      lieuNaissance: '',
      adresse: '',
      telephoneParent: '',
      emailParent: '',
      nomParent: '',
      postnomParent: '',
      prenomParent: '',
      etat: 'actif'
    })
  }
}, { immediate: true })

async function onSubmit() {
  saving.value = true
  error.value = null
  
  if (!form.nom || !form.nom.trim()) {
    error.value = 'Le nom est requis'
    saving.value = false
    return
  }
  if (form.sexe && !['M', 'F'].includes(form.sexe)) {
    error.value = 'Le sexe doit être M ou F'
    saving.value = false
    return
  }
  
  try {
    await emit('save', { ...form })
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}
</script>