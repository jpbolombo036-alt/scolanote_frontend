export interface Attendance {
  id: number
  studentId: number
  periodId: number
  date: string
  retard: boolean
  absence: boolean
  motif?: string
  createdAt?: string
  updatedAt?: string
}

export interface AttendanceRequest {
  studentId: number
  periodId: number
  date: string
  retard?: boolean
  absence?: boolean
  motif?: string
}

export interface AttendanceResponse {
  id: number
  studentId: number
  studentNom?: string
  studentMatricule?: string
  periodId: number
  date: string
  retard: boolean
  absence: boolean
  motif?: string
  createdAt?: string
  updatedAt?: string
}
