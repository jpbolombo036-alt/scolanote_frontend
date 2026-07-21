export interface Enrollment {
  id: number
  studentId: number
  classroomId: number
  dateInscription?: string
  numeroOrdre?: number
  etat?: string
  createdAt?: string
  updatedAt?: string
}

export interface EnrollmentRequest {
  studentId: number
  classroomId: number
  dateInscription?: string
  numeroOrdre?: number
  etat?: string
}

export interface EnrollmentResponse {
  id: number
  studentId: number
  classroomId: number
  dateInscription?: string
  numeroOrdre?: number
  etat?: string
  createdAt?: string
  updatedAt?: string
}
