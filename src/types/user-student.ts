export interface UserStudent {
  id: number
  userId: number
  username?: string
  studentId: number
  studentNom?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserStudentRequest {
  userId: number
  studentId: number
}

export interface UserStudentResponse {
  id: number
  userId: number
  username?: string
  studentId: number
  studentNom?: string
  createdAt?: string
  updatedAt?: string
}