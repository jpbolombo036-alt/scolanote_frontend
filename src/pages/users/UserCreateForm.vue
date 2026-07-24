<template>
  <div v-if="show" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
    <div class="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
      
      <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">
          Créer un utilisateur
        </h2>
        <button
          @click="$emit('close')"
          class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
          <div>
            <label class="block mb-1.5 font-semibold">Nom d'utilisateur <span class="text-red-500">*</span></label>
            <input
              v-model="form.username"
              type="text"
              required
              placeholder="Ex: mkalala"
              class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition"
            />
          </div>
          <div>
            <label class="block mb-1.5 font-semibold">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Ex: m.kalala@ecole.cd"
              class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition"
            />
          </div>
          <div>
            <label class="block mb-1.5 font-semibold">Téléphone</label>
            <input
              v-model="form.telephone"
              type="text"
              placeholder="Ex: +243891234567"
              class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition"
            />
          </div>
          <div>
            <label class="block mb-1.5 font-semibold">Mot de passe <span class="text-red-500">*</span></label>
            <input
              v-model="form.password"
              type="text"
              required
              placeholder="Mot de passe initial"
              class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block mb-1.5 font-semibold">Rôle <span class="text-red-500">*</span></label>
            <input
              v-model="form.role"
              type="text"
              required
              placeholder="Ex: ENSEIGNANT, ADMIN, SUPER_ADMIN, DIRECTEUR, PREFET"
              class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-medium">
          {{ error }}
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2.5 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
          >
            {{ saving ? 'Création...' : 'Créer l\'utilisateur' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'created'])

const saving = ref(false)
const error = ref(null)

const form = reactive({
  username: '',
  email: '',
  telephone: '',
  password: '',
  role: ''
})

async function onSubmit() {
  saving.value = true
  error.value = null
  try {
    const payload = {
      username: form.username,
      email: form.email || '',
      telephone: form.telephone || '',
      password: form.password,
      role: form.role
    }
    await emit('created', payload)
    emit('close')
  } catch (e) {
    console.error('Erreur lors de la création de l\'utilisateur', e)
    error.value = e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la création de l\'utilisateur'
  } finally {
    saving.value = false
  }
}
</script>
