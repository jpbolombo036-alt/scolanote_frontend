<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full">
      <div class="bg-white shadow-lg rounded-lg p-8">
        <h1 class="text-3xl font-bold text-center text-primary-600 mb-2">ScolaNote</h1>
        <p class="text-center text-gray-600 mb-8">Gestion des bulletins scolaires</p>

        <form @submit.prevent="login">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <input v-model="form.username" type="text" required class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input v-model="form.password" type="password" required class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div v-if="error" class="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">{{ error }}</div>
          <button type="submit" :disabled="loading" class="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref(null)

async function login() {
  loading.value = true
  error.value = null
  try {
    await authStore.login(form.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>
