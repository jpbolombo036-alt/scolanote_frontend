import { ref, watch } from 'vue'
import api from '@/api/axios'

/**
 * Calcule automatiquement le numéro d'ordre d'un élève dans une classe,
 * sur la base du nombre d'inscriptions déjà présentes pour cette classe (+1).
 *
 * @param {() => any} classroomIdSource - getter (ou ref) retournant le classroomId courant
 */
export function useNumeroOrdre(classroomIdSource) {
  const numeroOrdre = ref(null)
  const loading = ref(false)

  const getClassroomId = () =>
    typeof classroomIdSource === 'function' ? classroomIdSource() : classroomIdSource?.value

  async function recompute() {
    const classroomId = getClassroomId()
    if (classroomId == null || classroomId === '') {
      numeroOrdre.value = null
      return
    }
    loading.value = true
    try {
      const res = await api.get('/api/inscriptions')
      const data = res.data
      const list = Array.isArray(data) ? data : (data.content || [])
      const count = list.filter(
        (e) => Number(e.classroom?.id ?? e.classroomId) === Number(classroomId)
      ).length
      numeroOrdre.value = count + 1
    } catch {
      numeroOrdre.value = null
    } finally {
      loading.value = false
    }
  }

  watch(getClassroomId, recompute, { immediate: true })

  return { numeroOrdre, loading, recompute }
}