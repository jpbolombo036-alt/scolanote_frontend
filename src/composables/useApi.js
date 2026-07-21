import { ref } from 'vue'
import axios from '@/api/axios'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  async function get(url, config = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(url, config)
      return response.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Erreur'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function post(url, data, config = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post(url, data, config)
      return response.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Erreur'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function put(url, data, config = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.put(url, data, config)
      return response.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Erreur'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function del(url, config = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.delete(url, config)
      return response.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Erreur'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, get, post, put, del }
}
