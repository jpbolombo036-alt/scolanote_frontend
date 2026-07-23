import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios'
import type { LoginRequest, LoginResponse, UserResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<UserResponse | null>(null)
  const roles = ref<string[]>([])

  const isAuthenticated = computed(() => !!token.value)
  const isDirection = computed(() => roles.value.some(r => ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET'].includes(r)))
  const isSuperAdmin = computed(() => roles.value.includes('SUPER_ADMIN'))
  const isAdminRole = computed(() => roles.value.includes('ADMIN'))
  const isDirecteur = computed(() => roles.value.includes('DIRECTEUR'))
  const isPrefet = computed(() => roles.value.includes('PREFET'))
  const isEnseignant = computed(() => roles.value.includes('ENSEIGNANT'))

  async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post('/auth/token', credentials)
    token.value = data.accessToken
    localStorage.setItem('token', data.accessToken)
    await fetchProfile()
    return data
  }

  async function fetchProfile() {
    try {
      const { data } = await api.get('/auth/me')
      user.value = data
      roles.value = data.roles || []
    } catch (e) {
      const status = e.response?.status
      if (status === 401 || status === 403) {
        logout()
      } else {
        console.error('Erreur lors du chargement du profil utilisateur', e)
      }
    }
  }

  function logout() {
    token.value = null
    user.value = null
    roles.value = []
    localStorage.removeItem('token')
  }

  return { token, user, roles, isAuthenticated, isDirection, isSuperAdmin, isAdminRole, isDirecteur, isPrefet, isEnseignant, login, logout }
})
