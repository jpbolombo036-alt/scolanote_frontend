<template>
  <div class="max-w-3xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8 w-full">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ isEdit ? 'Modifier' : 'Nouveau' }} professeur</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accueil / Enseignants / {{ isEdit ? 'Modifier' : 'Nouveau professeur' }}</p>
        </div>
        <button @click="$router.back()" class="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Retour</button>
      </div>
    </div>

    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <div v-if="successMessage" class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 p-4 rounded-2xl text-sm font-medium flex items-start gap-2">
      <CheckCircle2 class="w-5 h-5 shrink-0 mt-0.5" />
      <div>
        <p class="font-bold mb-1">Professeur créé avec succès</p>
        <p v-if="createdTeacher?.accountCreated" class="text-xs opacity-90">
          Compte de connexion créé automatiquement.<br/>
          <strong>ID utilisateur :</strong> {{ createdTeacher.accountUserId }}<br/>
          <strong>Identifiant :</strong> {{ createdTeacher.accountUsername || createdTeacher.email }}<br/>
          <strong>Mot de passe temporaire :</strong> 12345678<br/>
          {{ createdTeacher.accountLoginHint || '' }}
        </p>
        <p v-else class="text-xs opacity-90">
          {{ createdTeacher?.accountLoginHint || 'Le compte de connexion n\'a pas pu être créé automatiquement. Contactez l\'administrateur.' }}
        </p>
      </div>
    </div>

    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8 w-full">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Spécialité</label>
            <input v-model="form.specialite" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Téléphone</label>
            <input v-model="form.telephone" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <input v-model="form.email" type="email" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
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
import { AlertCircle, CheckCircle2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isEdit = !!route.params.id
const saving = ref(false)
const error = ref(null)
const successMessage = ref('')
const createdTeacher = ref(null)

const form = reactive({
  nom: '',
  postnom: '',
  prenom: '',
  specialite: '',
  telephone: '',
  email: ''
})

onMounted(async () => {
  if (!isEdit) return
  try {
    const response = await api.get(`/api/enseignants/${route.params.id}`)
    Object.assign(form, response.data)
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement'
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  successMessage.value = ''
  createdTeacher.value = null
  try {
    const payload = { ...form }
    let response
    if (isEdit) {
      response = await api.put(`/api/enseignants/${route.params.id}`, payload)
    } else {
      response = await api.post('/api/enseignants', payload)
    }
    createdTeacher.value = response.data
    successMessage.value = 'Professeur enregistré avec succès'
    form.nom = ''
    form.postnom = ''
    form.prenom = ''
    form.specialite = ''
    form.telephone = ''
    form.email = ''
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}
</script>