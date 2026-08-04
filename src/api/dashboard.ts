import api from './axios'
import type { DashboardResponse } from '@/types'

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await api.get('/api/dashboard')
  return response.data
}