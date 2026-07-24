<template>
  <div class="min-h-screen w-full flex font-sans overflow-hidden">
    <!-- LEFT: Branding -->
    <div class="hidden lg:flex lg:w-[45%] relative bg-brand-600 text-white flex-col justify-between overflow-hidden">
      <!-- Curved right edge -->
      <div class="absolute top-0 right-0 h-full w-24 bg-white" style="clip-path: ellipse(100% 70% at 100% 50%);"></div>

      <div class="relative z-10 p-10 xl:p-14">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur">
            <GraduationCap class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold leading-none">Gest Bulletin</h1>
            <p class="text-sm text-blue-100 mt-1">Gestion de bulletins scolaires</p>
          </div>
        </div>
        <div class="w-12 h-1 bg-amber-400 rounded-full mb-5"></div>
        <p class="text-blue-50/90 text-sm xl:text-base leading-relaxed max-w-sm">
          Une plateforme simple et efficace pour gérer les notes et les bulletins scolaires.
        </p>
      </div>

      <!-- Laptop mockup scene -->
      <div class="relative z-10 px-8 xl:px-12 pb-10">
        <div class="relative mx-auto max-w-md">
          <img
            src="/images/login-hero.png"
            alt="Illustration login"
            class="w-full h-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </div>

    <!-- RIGHT: Form -->
    <div class="w-full lg:w-[55%] bg-white flex flex-col min-h-screen relative">
      <!-- Mobile brand -->
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
              <Lock class="w-6 h-6 text-brand-500" />
            </div>
            <h2 class="text-3xl font-extrabold text-ink">Connexion</h2>
            <p class="text-ink-soft text-sm mt-1">Connectez-vous à votre compte</p>
          </div>

          <form @submit.prevent="login" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-ink mb-1.5">Nom d'utilisateur</label>
              <div class="relative">
                <User class="w-5 h-5 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="form.username"
                  type="text"
                  required
                  placeholder="Entrez votre nom d'utilisateur"
                  class="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-ink mb-1.5">Mot de passe</label>
              <div class="relative">
                <Lock class="w-5 h-5 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Entrez votre mot de passe"
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

            <div class="flex items-center justify-between text-sm">
              <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                <input v-model="rememberMe" type="checkbox" class="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
                <span class="text-brand-600 font-medium">Se souvenir de moi</span>
              </label>
              <a href="#" class="text-brand-600 font-medium hover:underline">Mot de passe oublié ?</a>
            </div>

            <div v-if="error" class="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/30 disabled:opacity-60 transition inline-flex items-center justify-center gap-2"
            >
              <LogIn class="w-4 h-4" />
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>

          <div class="my-6 flex items-center gap-3">
            <div class="flex-1 h-px bg-slate-200"></div>
            <span class="text-xs text-ink-muted font-medium">ou</span>
            <div class="flex-1 h-px bg-slate-200"></div>
          </div>

          <button
            type="button"
            class="w-full h-12 rounded-xl border border-brand-500 text-brand-600 font-semibold text-sm hover:bg-brand-50 transition inline-flex items-center justify-center gap-2"
            @click="fillAdminHint"
          >
            <Shield class="w-4 h-4" />
            Se connecter en tant qu'administrateur
          </button>

          <p class="mt-8 text-center">
            <router-link to="/" class="text-sm text-ink-soft hover:text-brand-600 transition">← Retour à l'accueil</router-link>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  GraduationCap,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  Shield
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const year = new Date().getFullYear()

const form = ref({ username: '', password: '' })
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref(null)

const mockRows = [
  { name: 'Marie Dupont', mention: 'TB', badge: 'bg-emerald-100 text-emerald-700', avatar: 'bg-emerald-400' },
  { name: 'Jean Martin', mention: 'B', badge: 'bg-blue-100 text-blue-700', avatar: 'bg-blue-400' },
  { name: 'Sophie Leroy', mention: 'AB', badge: 'bg-amber-100 text-amber-700', avatar: 'bg-amber-400' },
  { name: 'Lucas Petit', mention: 'P', badge: 'bg-rose-100 text-rose-700', avatar: 'bg-rose-400' }
]

function fillAdminHint() {
  form.value.username = form.value.username || 'admin'
}

async function login() {
  loading.value = true
  error.value = null
  try {
    await authStore.login(form.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur de connexion. Veuillez vérifier vos identifiants.'
  } finally {
    loading.value = false
  }
}
</script>
