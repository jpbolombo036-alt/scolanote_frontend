export interface TeachingAssignment {
  id: number
  teacherId: number
  classroomId: number
  subjectId: number
  createdAt?: string
  updatedAt?: string
}

export interface TeachingAssignmentRequest {
  teacherId: number
  classroomId: number
  subjectId: number
}

export interface TeachingAssignmentResponse {
  id: number
  teacherId: number
  classroomId: number
  subjectId: number
  createdAt?: string
  updatedAt?: string
}
