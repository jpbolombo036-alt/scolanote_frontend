import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { isAxiosError } from 'axios'
import api from '@/api/axios'
import type { LoginRequest, LoginResponse, UserResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<UserResponse | null>(null)
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const schoolId = ref<number | null>(null)
  const passwordResetRequired = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isDirection = computed(() => roles.value.some(r => ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET'].includes(r)))
  const isSuperAdmin = computed(() => roles.value.includes('SUPER_ADMIN'))
  const isAdminRole = computed(() => roles.value.includes('ADMIN'))
  const isDirecteur = computed(() => roles.value.includes('DIRECTEUR'))
  const isPrefet = computed(() => roles.value.includes('PREFET'))
  const canGenerateAcademicYearBulletins = computed(() => permissions.value.includes('BULLETIN_ANNUEL_GENERER'))
  const isEnseignant = computed(() => roles.value.includes('ENSEIGNANT'))

  async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post('/auth/token', credentials)
    token.value = data.accessToken
    localStorage.setItem('token', data.accessToken)

    // Idéalement, la réponse de /auth/token contient déjà tout
    user.value = data.user
    roles.value = data.user.roles || []
    permissions.value = data.user.permissions || [] // Assurez-vous que le backend envoie bien les permissions
    schoolId.value = data.user.schoolId ?? null
    passwordResetRequired.value = data.user.passwordResetRequired ?? false

    return data
  }

  async function fetchProfile() {
    try {
      const { data } = await api.get('/auth/me')
      user.value = data
      roles.value = data.roles || []
      permissions.value = data.permissions || []
      schoolId.value = data.schoolId ?? null
      passwordResetRequired.value = false
    } catch (e) {
      const status = isAxiosError(e) ? e.response?.status : undefined
      if (status === 401 || status === 403) {
        logout()
      } else {
        console.error('Erreur lors du chargement du profil utilisateur', e)
      }
    }
  }

  function clearPasswordResetRequired() {
    passwordResetRequired.value = false
  }

  function logout() {
    token.value = null
    user.value = null
    roles.value = []
    permissions.value = []
    schoolId.value = null
    passwordResetRequired.value = false
    localStorage.removeItem('token')
  }

  return { token, user, roles, permissions, schoolId, passwordResetRequired, isAuthenticated, isDirection, isSuperAdmin, isAdminRole, isDirecteur, isPrefet, isEnseignant, canGenerateAcademicYearBulletins, login, fetchProfile, logout, clearPasswordResetRequired }
})
