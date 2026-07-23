<template>
  <div class="min-h-screen w-full flex flex-col lg:flex-row bg-[#f3f6fc] font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
    
    <!-- LEFT PANEL: Hero & Branding (Visible on lg screens and up) -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#06183b] via-[#092b77] to-[#041235] text-white p-12 flex-col justify-between overflow-hidden select-none">
      
      <!-- Background Decorative Grid & Glow -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1d4ed8_0,transparent_50%)] opacity-40"></div>
      <div class="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-10 right-0 w-96 h-96 bg-sky-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- World map / Geometric SVG Overlay -->
      <svg class="absolute inset-0 w-full h-full opacity-15 pointer-events-none stroke-current text-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 800 800">
        <path d="M150 200 C300 150, 450 300, 650 200 M100 400 C350 350, 450 500, 750 450 M200 650 C400 550, 500 700, 700 600" stroke-width="1.5" stroke-dasharray="6 6" />
        <circle cx="200" cy="200" r="4" fill="currentColor" />
        <circle cx="650" cy="200" r="4" fill="currentColor" />
        <circle cx="350" cy="350" r="4" fill="currentColor" />
        <circle cx="750" cy="450" r="4" fill="currentColor" />
        <circle cx="400" cy="550" r="4" fill="currentColor" />
      </svg>

      <!-- Brand Header -->
      <div class="relative z-10 flex items-center space-x-3.5">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-2 ring-white/20">
          <span class="text-white font-extrabold text-2xl tracking-wider">S</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white leading-none">ScolaNote</h1>
          <p class="text-xs text-blue-200/80 font-medium mt-1">Plateforme de gestion scolaire</p>
        </div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 my-auto py-12 max-w-xl">
        <h2 class="text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight text-white mb-6">
          Gérez.<br />
          Analysez.<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-300">Développez.</span>
        </h2>
        <p class="text-base xl:text-lg text-blue-100/80 leading-relaxed font-normal">
          Une plateforme tout-en-un pour gérer vos notes, bulletins, inscriptions, élèves, enseignants et établissements en toute simplicité.
        </p>
      </div>

      <!-- Bottom Feature Badges -->
      <div class="relative z-10 grid grid-cols-4 gap-4 pt-6 border-t border-white/10">
        <!-- Badge 1: Évaluations -->
        <div class="flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-2xl bg-blue-600/90 hover:bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 transition-transform duration-200 hover:-translate-y-1">
            <GraduationCap class="w-6 h-6 text-white" />
          </div>
          <span class="text-xs font-semibold text-blue-100 mt-2.5">Évaluations</span>
        </div>

        <!-- Badge 2: Élèves -->
        <div class="flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/90 hover:bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform duration-200 hover:-translate-y-1">
            <Users class="w-6 h-6 text-white" />
          </div>
          <span class="text-xs font-semibold text-blue-100 mt-2.5">Élèves</span>
        </div>

        <!-- Badge 3: Bulletins -->
        <div class="flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-2xl bg-purple-600/90 hover:bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30 transition-transform duration-200 hover:-translate-y-1">
            <FileText class="w-6 h-6 text-white" />
          </div>
          <span class="text-xs font-semibold text-blue-100 mt-2.5">Bulletins</span>
        </div>

        <!-- Badge 4: Analyses -->
        <div class="flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/90 hover:bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 transition-transform duration-200 hover:-translate-y-1">
            <BarChart3 class="w-6 h-6 text-white" />
          </div>
          <span class="text-xs font-semibold text-blue-100 mt-2.5">Analyses</span>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL: Login Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-between items-center p-6 sm:p-12 min-h-screen relative">
      
      <!-- Mobile Top Brand Header -->
      <div class="lg:hidden w-full max-w-md flex items-center justify-between mb-8">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            S
          </div>
          <div>
            <h1 class="text-lg font-bold text-slate-900">ScolaNote</h1>
            <p class="text-xs text-slate-500">Gestion scolaire</p>
          </div>
        </div>
      </div>

      <!-- Main Login Card -->
      <div class="my-auto w-full max-w-[440px]">
        <div class="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,112,184,0.08)] border border-slate-100 p-8 sm:p-10 transition-all duration-300">
          
          <!-- Card Avatar / Header -->
          <div class="text-center mb-8">
            <div class="relative inline-flex mb-4">
              <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-500/30 ring-4 ring-blue-50">
                S
              </div>
              <span class="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full"></span>
            </div>
            
            <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Connexion</h2>
            <p class="text-xs text-slate-400 font-medium mt-1">Accédez à votre compte Scolanote</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="login" class="space-y-5">
            <!-- Email / Username Input -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Email ou nom d'utilisateur <span class="text-red-500">*</span>
              </label>
              <div class="relative flex items-center">
                <Mail class="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  v-model="form.username"
                  type="text"
                  required
                  placeholder="nom d'utilisateur"
                  class="w-full bg-[#f0f4fb] hover:bg-[#ebf0f9] focus:bg-white text-slate-800 text-sm font-medium pl-11 pr-4 py-3.5 rounded-2xl border border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 placeholder-slate-400"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Mot de passe <span class="text-red-500">*</span>
              </label>
              <div class="relative flex items-center">
                <Lock class="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••"
                  class="w-full bg-[#f0f4fb] hover:bg-[#ebf0f9] focus:bg-white text-slate-800 text-sm font-medium pl-11 pr-11 py-3.5 rounded-2xl border border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 placeholder-slate-400"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Options: Remember Me -->
            <div class="flex items-center justify-between pt-1">
              <label class="flex items-center space-x-2.5 cursor-pointer group">
                <input
                  v-model="rememberMe"
                  type="checkbox"
                  class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 transition cursor-pointer"
                />
                <span class="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition">Se souvenir de moi</span>
              </label>
            </div>

            <!-- Error Banner -->
            <div v-if="error" class="rounded-xl bg-red-50 text-red-600 p-3.5 text-xs font-medium border border-red-100 flex items-center space-x-2">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
              <span>{{ error }}</span>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.99] text-white font-semibold py-3.5 px-6 rounded-2xl text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 disabled:opacity-60 transition-all duration-200 flex items-center justify-between group"
            >
              <Lock class="w-4 h-4 opacity-80" />
              <span>{{ loading ? 'Connexion...' : 'Se connecter' }}</span>
              <ArrowRight class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <!-- Card Footer Links -->
          <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center space-x-4 text-xs font-medium text-slate-400">
            <a href="#" class="inline-flex items-center hover:text-blue-600 transition">
              <BookOpen class="w-4 h-4 mr-1.5" />
              Documentation
            </a>
            <span class="text-slate-200">|</span>
            <a href="#" class="inline-flex items-center hover:text-blue-600 transition">
              <Shield class="w-4 h-4 mr-1.5" />
              Politique de confidentialité
            </a>
          </div>

        </div>
      </div>

      <!-- Page Bottom Copyright Footer -->
      <div class="w-full text-center lg:text-right mt-6 text-xs text-slate-400 font-medium">
        © 2026 Scolanote. Tous droits réservés. par <span class="font-bold text-slate-600">KANSA BUSINESS</span>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  Shield,
  GraduationCap,
  Users,
  FileText,
  BarChart3
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref(null)

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
