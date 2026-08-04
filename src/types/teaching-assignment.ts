export interface TeachingAssignment {
  id: number
  teacherId: number
  teacherNom?: string
  classroomId: number
  classroomNom?: string
  subjectId: number
  subjectNom?: string
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
  teacherNom?: string
  classroomId: number
  classroomNom?: string
  subjectId: number
  subjectNom?: string
  createdAt?: string
  updatedAt?: string
}
