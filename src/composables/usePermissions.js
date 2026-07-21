import { useAuthStore } from '@/stores/auth'

export function usePermissions() {
  const authStore = useAuthStore()

  function canCreate() {
    return authStore.isDirection
  }

  function canEdit() {
    return authStore.isDirection
  }

  function canDelete() {
    return authStore.isSuperAdmin
  }

  function canGenerateBulletins() {
    return authStore.isDirection
  }

  function isEnseignant() {
    return authStore.isEnseignant
  }

  return {
    canCreate,
    canEdit,
    canDelete,
    canGenerateBulletins,
    isEnseignant
  }
}
