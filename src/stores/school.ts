import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { School, SchoolRequest } from '@/types'
import * as schoolsApi from '@/api/schools'

export const useSchoolStore = defineStore('school', () => {
  const items = ref<School[]>([])
  const current = ref<School | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(params?: { page?: number; size?: number; sort?: string }) {
    loading.value = true
    error.value = null
    try {
      const data = await schoolsApi.getAllSchools(params)
      items.value = data.content
      return data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchAllUnpaginated() {
    loading.value = true
    error.value = null
    try {
      items.value = await schoolsApi.getAllSchoolsUnpaginated()
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number) {
    loading.value = true
    error.value = null
    try {
      current.value = await schoolsApi.getSchool(id)
      return current.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function create(data: SchoolRequest) {
    loading.value = true
    error.value = null
    try {
      const created = await schoolsApi.createSchool(data)
      items.value.push(created)
      return created
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, data: SchoolRequest) {
    loading.value = true
    error.value = null
    try {
      const updated = await schoolsApi.updateSchool(id, data)
      const idx = items.value.findIndex(s => s.id === id)
      if (idx !== -1) items.value[idx] = updated
      if (current.value?.id === id) current.value = updated
      return updated
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    loading.value = true
    error.value = null
    try {
      await schoolsApi.deleteSchool(id)
      items.value = items.value.filter(s => s.id !== id)
      if (current.value?.id === id) current.value = null
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { items, current, loading, error, fetchAll, fetchAllUnpaginated, fetchById, create, update, remove }
})
