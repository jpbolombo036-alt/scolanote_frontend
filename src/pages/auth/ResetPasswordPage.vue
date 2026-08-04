<template>
  <div class="min-h-screen w-full flex font-sans overflow-hidden">
    <div class="hidden lg:flex lg:w-[45%] relative bg-brand-600 text-white flex-col overflow-hidden">
      <div
        class="absolute top-0 right-0 h-full w-28 bg-white pointer-events-none"
        style="clip-path: ellipse(100% 65% at 100% 50%);"
      ></div>
      <div class="absolute -left-20 top-1/3 w-72 h-72 rounded-full border border-white/10 pointer-events-none"></div>
      <div class="absolute -left-10 top-1/3 w-56 h-56 rounded-full border border-white/10 pointer-events-none"></div>
      <div class="absolute bottom-10 right-24 w-40 h-40 rounded-full border border-white/10 pointer-events-none"></div>
      <div class="relative z-10 flex flex-col h-full p-10 xl:p-12">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur">
            <GraduationCap class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold leading-none">Gest Bulletin</h1>
            <p class="text-sm text-blue-100 mt-1">Gestion de bulletins scolaires</p>
          </div>
        </div>
        <div class="w-12 h-1 bg-amber-400 rounded-full mb-5"></div>
        <p class="text-blue-50/90 text-sm xl:text-base leading-relaxed max-w-sm mb-8">
          Une plateforme simple et efficace pour gérer les notes et les bulletins scolaires.
        </p>
      </div>
    </div>
    <div class="w-full lg:w-[55%] bg-white flex flex-col min-h-screen relative">
      <div class="lg:hidden p-6 flex items-center gap-3 bg-brand-600 text-white">
        <GraduationCap class="w-8 h-8" />
        <div>
          <p class="font-bold text-lg leading-none">Gest Bulletin</p>
          <p class="text-xs text-blue-100 mt-0.5">Gestion de bulletins scolaires</p>
        </div>
      </div>
      <div class="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-10">
        <div class="w-full max-w-md mx-auto">
          <div class="mb-8">
            <div class="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mb-4">
              <KeyRound class="w-6 h-6 text-brand-500" />
            </div>
            <h2 class="text-3xl font-extrabold text-ink">Réinitialiser le mot de passe</h2>
            <p class="text-ink-soft text-sm mt-1">Saisissez le token et votre nouveau mot de passe</p>
          </div>
          <form @submit.prevent="resetPassword" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-ink mb-1.5">Token de réinitialisation</label>
              <div class="relative">
                <KeyRound class="w-5 h-5 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="form.token"
                  type="text"
                  required
                  placeholder="Token reçu par email"
                  class="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-ink mb-1.5">Nouveau mot de passe</label>
              <div class="relative">
                <Lock class="w-5 h-5 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="form.newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Votre nouveau mot de passe"
                  class="w-full h-12 pl-11 pr-11 rounded-xl bg-slate-50 border border-slate-200 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                />
                <button
                  type="button"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-ink mb-1.5">Confirmer le mot de passe</label>
              <div class="relative">
                <Lock class="w-5 h-5 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  placeholder="Confirmez votre mot de passe"
                  class="w-full h-12 pl-11 pr-11 rounded-xl bg-slate-50 border border-slate-200 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                />
                <button
                  type="button"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>
            <div v-if="error" class="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">
              {{ error }}
            </div>
            <div v-if="success" class="rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm px-4 py-3">
              {{ success }}
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/30 disabled:opacity-60 transition inline-flex items-center justify-center gap-2"
            >
              <Lock v-if="!loading" class="w-4 h-4" />
              <Loader v-else class="w-4 h-4 animate-spin" />
              {{ loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
            </button>
          </form>
          <p class="mt-8 text-center">
            <router-link to="/login" class="text-sm text-ink-soft hover:text-brand-600 transition">
              ← Retour à la connexion
            </router-link>
          </p>
        </div>
      </div>
      <p class="text-center lg:text-right text-xs text-ink-muted px-6 pb-6">
        © {{ year }} GestBulletin. Tous droits réservés.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { resetPassword as apiResetPassword } from '@/api/auth'
import {
  GraduationCap,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Loader
} from 'lucide-vue-next'

const year = new Date().getFullYear()

const form = ref({ token: new URLSearchParams(window.location.search).get('token') || '', newPassword: '', confirmPassword: '' })
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref(null)
const success = ref(null)

async function resetPassword() {
  loading.value = true
  error.value = null
  success.value = null

  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas.'
    loading.value = false
    return
  }

  try {
    await apiResetPassword(form.value.token, form.value.newPassword)
    success.value = 'Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.'
    form.value.token = ''
    form.value.newPassword = ''
    form.value.confirmPassword = ''
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur de réinitialisation. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>