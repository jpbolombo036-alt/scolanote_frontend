<template>
  <div class="max-w-3xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8 w-full">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ isEdit ? 'Modifier' : 'Nouvel' }} élève</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accueil / Élèves / {{ isEdit ? 'Modifier' : 'Nouvel élève' }}</p>
        </div>
        <button @click="$router.back()" class="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Retour</button>
      </div>
    </div>

    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- ÉCRAN APRÈS CRÉATION : succès + état de l'inscription -->
    <div v-else-if="createdStudent" class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8 w-full">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-lg font-extrabold text-slate-900 dark:text-white">Élève créé {{ inscriptionSuccess ? 'et inscrit' : 'avec succès' }}</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            <template v-if="inscriptionSuccess">
              <b>{{ createdStudent.nom }} {{ createdStudent.prenom || '' }}</b> a été inscrit dans la classe <b>{{ createdClassroomName }}</b>.
            </template>
            <template v-else>
              <b>{{ createdStudent.nom }} {{ createdStudent.prenom || '' }}</b> a bien été enregistré.
            </template>
          </p>
        </div>
      </div>

      <div v-if="inscriptionError" class="mt-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
        <AlertCircle class="w-5 h-5 shrink-0" />
        <span>{{ inscriptionError }}</span>
      </div>

      <div class="flex flex-wrap gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80">
        <button
          v-if="!inscriptionSuccess && pendingEnrollment"
          @click="retryEnrollment"
          :disabled="saving"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/25 transition disabled:opacity-50"
        >
          <RefreshCw class="w-4 h-4" />
          {{ saving ? 'Inscription en cours...' : "Réessayer l'inscription" }}
        </button>
        <button
          v-if="!inscriptionSuccess"
          @click="router.push(`/inscriptions/form?studentId=${createdStudent.id}`)"
          class="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ClipboardList class="w-4 h-4" />
          Aller à l'inscription
        </button>
        <button
          v-if="inscriptionSuccess"
          @click="router.push('/inscriptions')"
          class="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ClipboardList class="w-4 h-4" />
          Voir les inscriptions
        </button>
        <button
          @click="router.push('/eleves')"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition"
        >
          Retour aux élèves
        </button>
      </div>
    </div>

    <div v-else class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8 w-full">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Matricule <span class="text-slate-400 text-[10px]">(laisser vide pour générer automatiquement)</span></label>
            <input v-model="form.matricule" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nom <span class="text-red-500">*</span></label>
            <input v-model="form.nom" type="text" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Postnom</label>
            <input v-model="form.postnom" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Prénom</label>
            <input v-model="form.prenom" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Sexe</label>
            <select v-model="form.sexe" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none">
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date de naissance</label>
            <input v-model="form.dateNaissance" type="date" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Lieu de naissance</label>
            <input v-model="form.lieuNaissance" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Adresse</label>
            <input v-model="form.adresse" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Téléphone parent</label>
            <input v-model="form.telephoneParent" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email parent</label>
            <input v-model="form.emailParent" type="email" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
        </div>

        <!-- INSCRIPTION IMMÉDIATE (mode création uniquement) -->
        <div v-if="!isEdit" class="border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
              <ClipboardList class="w-4 h-4" />
            </div>
            <div class="flex-1">
              <h2 class="text-sm font-bold text-slate-900 dark:text-white">Inscription immédiate</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Inscrivez cet élève dans une classe dès sa création.</p>
            </div>
            <label class="inline-flex items-center gap-2 cursor-pointer select-none ml-auto">
              <input v-model="enrollOnCreate" type="checkbox" class="w-4 h-4 rounded border-slate-200 dark:border-slate-600 text-brand-500 focus:ring-brand-500/30" />
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Inscrire cet élève</span>
            </label>
          </div>

          <div :class="['grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 transition-opacity duration-150', !enrollOnCreate && 'opacity-40 pointer-events-none']">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Classe <span class="text-red-500">*</span></label>
              <select
                v-model="enrollmentForm.classroomId"
                :disabled="!enrollOnCreate"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-emerald-500 transition appearance-none disabled:cursor-not-allowed"
              >
                <option value="">Sélectionner</option>
                <option v-for="c in classrooms" :key="c.id" :value="Number(c.id)">{{ c.nom }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date d'inscription</label>
              <input
                v-model="enrollmentForm.dateInscription"
                type="date"
                :disabled="!enrollOnCreate"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Numéro d'ordre <span class="text-slate-400 text-[10px]">(automatique)</span></label>
              <div class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium flex items-center gap-2" :class="!enrollOnCreate && 'opacity-40'">
                <Hash class="w-4 h-4 text-slate-400 shrink-0" />
                <span v-if="loadingNumeroOrdre" class="text-slate-400">Calcul…</span>
                <span v-else-if="autoNumeroOrdre" class="font-bold text-brand-600 dark:text-brand-400">N° {{ autoNumeroOrdre }}</span>
                <span v-else class="text-slate-400">—</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button type="button" @click="$router.back()" class="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Annuler</button>
          <button type="submit" :disabled="saving" class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-brand-500/25 transition disabled:opacity-50">
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
import { AlertCircle, CheckCircle2, ClipboardList, RefreshCw, Hash } from 'lucide-vue-next'
import { useNumeroOrdre } from '@/composables/useNumeroOrdre'

const route = useRoute()
const router = useRouter()

const isEdit = !!route.params.id
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
  etat: 'actif'
})

// --- Inscription immédiate (mode création) ---
const classrooms = ref([])
const enrollOnCreate = ref(true)
const enrollmentForm = reactive({
  classroomId: '',
  dateInscription: new Date().toISOString().slice(0, 10),
  numeroOrdre: null
})

// Numéro d'ordre calculé automatiquement selon les inscriptions de la classe
const { numeroOrdre: autoNumeroOrdre, loading: loadingNumeroOrdre } = useNumeroOrdre(() => enrollmentForm.classroomId)

// États post-création
const createdStudent = ref(null)
const inscriptionSuccess = ref(false)
const inscriptionError = ref(null)
const createdClassroomName = ref('')
const pendingEnrollment = ref(null)

onMounted(async () => {
  if (!isEdit) {
    try {
      const res = await api.get('/api/salles')
      classrooms.value = Array.isArray(res.data) ? res.data : (res.data.content || [])
    } catch (e) {
      error.value = e.response?.data?.message || 'Erreur lors du chargement des classes'
    }
    return
  }
  try {
    const response = await api.get(`/api/eleves/${route.params.id}`)
    Object.assign(form, response.data)
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement'
  }
})

async function performEnrollment() {
  await api.post('/api/inscriptions', pendingEnrollment.value)
  inscriptionSuccess.value = true
  inscriptionError.value = null
}

async function retryEnrollment() {
  if (!pendingEnrollment.value || !createdStudent.value) return
  saving.value = true
  inscriptionError.value = null
  try {
    await performEnrollment()
  } catch (e) {
    inscriptionError.value = e.response?.data?.message || "L'inscription a échoué. Réessayez."
  } finally {
    saving.value = false
  }
}

async function onSubmit() {
  saving.value = true
  error.value = null
  inscriptionError.value = null
  try {
    const payload = { ...form }
    if (isEdit) {
      await api.put(`/api/eleves/${route.params.id}`, payload)
      router.push('/eleves')
      return
    }

    // 1) Créer l'élève
    const created = await api.post('/api/eleves', payload)
    createdStudent.value = created.data

    // 2) Inscription immédiate (optionnelle, cochée par défaut)
    if (enrollOnCreate.value) {
      const classroom = classrooms.value.find(c => Number(c.id) === Number(enrollmentForm.classroomId))
      if (!classroom) {
        inscriptionError.value = "L'élève a été créé. Sélectionnez une classe si vous souhaitez l'inscrire maintenant."
      } else {
        createdClassroomName.value = classroom.nom
        pendingEnrollment.value = {
          studentId: created.data.id,
          classroomId: Number(classroom.id),
          dateInscription: enrollmentForm.dateInscription || new Date().toISOString().slice(0, 10),
          numeroOrdre: autoNumeroOrdre.value ?? null
        }
        await performEnrollment()
      }
    }
  } catch (e) {
    if (createdStudent.value && !inscriptionSuccess.value) {
      inscriptionError.value = e.response?.data?.message || "L'élève a bien été créé mais l'inscription a échoué."
    } else {
      error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la sauvegarde'
    }
  } finally {
    saving.value = false
  }
}
</script>