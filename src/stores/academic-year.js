import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AcademicYear, AcademicYearRequest } from '@/types'
import * as academicYearsApi from '@/api/academic-years'

export const useAcademicYearStore = defineStore('academicYear', () => {
  const items = ref([])
  const current = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll(params) {
    loading.value = true
    error.value = null
    try {
      const data = await academicYearsApi.getAllAcademicYears(params)
      items.value = data.content
      return data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    error.value = null
    try {
      current.value = await academicYearsApi.getAcademicYear(id)
      return current.value
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    loading.value = true
    error.value = null
    try {
      const created = await academicYearsApi.createAcademicYear(data)
      items.value.push(created)
      return created
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id, data) {
    loading.value = true
    error.value = null
    try {
      const updated = await academicYearsApi.updateAcademicYear(id, data)
      const idx = items.value.findIndex(y => y.id === id)
      if (idx !== -1) items.value[idx] = updated
      if (current.value?.id === id) current.value = updated
      return updated
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id) {
    loading.value = true
    error.value = null
    try {
      await academicYearsApi.deleteAcademicYear(id)
      items.value = items.value.filter(y => y.id !== id)
      if (current.value?.id === id) current.value = null
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { items, current, loading, error, fetchAll, fetchById, create, update, remove }
})
