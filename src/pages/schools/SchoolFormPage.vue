<template>
  <div class="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ isEdit ? 'Modifier' : 'Créer' }} une école</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accueil / Écoles / {{ isEdit ? 'Modifier' : 'Nouvelle école' }}</p>
      </div>
      <button @click="$router.back()" class="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Retour</button>
    </div>

    <div v-if="success" class="bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-400 p-4 rounded-2xl text-sm font-medium flex items-start gap-2">
      <CheckCircle2 class="w-5 h-5 shrink-0 mt-0.5" />
      <span>{{ success }}</span>
    </div>

    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <div v-if="credentials" class="bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300 p-5 rounded-2xl text-sm font-medium space-y-3">
      <p class="font-bold text-xs uppercase tracking-wider">Identifiants admin créés automatiquement</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p class="text-xs text-ink-soft mb-1">Username</p>
          <div class="flex items-center gap-2">
            <code class="flex-1 bg-white/80 dark:bg-slate-800/60 px-3 py-2 rounded-lg text-xs font-mono border border-brand-500/20">{{ credentials.adminUsername }}</code>
            <button @click="copyText(credentials.adminUsername)" class="p-2 rounded-lg hover:bg-brand-500/20 transition" title="Copier">
              <Copy class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div>
          <p class="text-xs text-ink-soft mb-1">Mot de passe</p>
          <div class="flex items-center gap-2">
            <code class="flex-1 bg-white/80 dark:bg-slate-800/60 px-3 py-2 rounded-lg text-xs font-mono border border-brand-500/20">{{ credentials.adminPassword }}</code>
            <button @click="copyText(credentials.adminPassword)" class="p-2 rounded-lg hover:bg-brand-500/20 transition" title="Copier">
              <Copy class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <p class="text-xs text-ink-muted">Ces identifiants ne seront affichés qu'une seule fois. Veuillez les sauvegarder ou les transmettre au directeur de l'école.</p>
      <div class="pt-2">
        <button type="button" @click="goBack" class="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/25 transition">
          Retour à la liste
        </button>
      </div>
    </div>

    <div v-else class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 md:p-8 max-w-3xl">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nom de l'école <span class="text-red-500">*</span></label>
            <input v-model="form.nom" type="text" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Code <span class="text-red-500">*</span></label>
            <input v-model="form.code" type="text" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email <span class="text-red-500">*</span></label>
            <input v-model="form.email" type="email" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Province <span class="text-red-500">*</span></label>
            <input v-model="form.province" type="text" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Commune / Territoire <span class="text-red-500">*</span></label>
            <input v-model="form.communeTerritoire" type="text" required class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Adresse complète</label>
            <input v-model="form.adresse" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Téléphone</label>
            <input v-model="form.telephone" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Logo (URL)</label>
            <input v-model="form.logo" type="text" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 transition" />
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
import { AlertCircle, CheckCircle2, Copy } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isEdit = !!route.params.id
const saving = ref(false)
const error = ref(null)
const success = ref(null)
const credentials = ref(null)

const form = reactive({
  nom: '',
  code: '',
  province: '',
  communeTerritoire: '',
  adresse: '',
  telephone: '',
  email: '',
  logo: ''
})

onMounted(async () => {
  if (!isEdit) return
  try {
    const response = await api.get(`/api/ecoles/${route.params.id}`)
    Object.assign(form, response.data)
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement'
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  success.value = null
  credentials.value = null
  try {
    if (isEdit) {
      await api.put(`/api/ecoles/${route.params.id}`, form)
      success.value = 'École modifiée avec succès'
    } else {
      const response = await api.post('/api/ecoles', form)
      credentials.value = {
        adminUsername: response.data.adminUsername,
        adminPassword: response.data.adminPassword
      }
      success.value = 'École créée avec succès. Identifiants admin générés ci-dessous.'
    }
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur'
  } finally {
    saving.value = false
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text)
}

function goBack() {
  router.push('/ecoles')
}
</script>