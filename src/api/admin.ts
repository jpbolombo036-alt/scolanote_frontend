import api from './axios'
import type { AxiosResponse } from 'axios'

export function listReports() {
  return api.get('/api/admin/rapports').then(r => r.data)
}

export function generateReport(reportKey: string): Promise<AxiosResponse<ArrayBuffer>> {
  return api.get(`/api/admin/rapports/${reportKey}`, { responseType: 'arraybuffer' })
}

export function startExport(params: any) {
  return api.post('/api/admin/exports', params).then(r => r.data)
}

export function listExports() {
  return api.get('/api/admin/exports').then(r => r.data)
}

export function downloadExport(exportId: string) {
  return api.get(`/api/admin/exports/${exportId}`, { responseType: 'arraybuffer' })
}

export function uploadImport(file: File) {
  const form = new FormData()
  form.append('file', file)
  return api.post('/api/admin/imports', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
}

export function createBackup() {
  return api.post('/api/admin/sauvegardes').then(r => r.data)
}

export function listBackups() {
  return api.get('/api/admin/sauvegardes').then(r => r.data)
}
