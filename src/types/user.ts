export interface User {
  id: number
  username: string
  email?: string
  password?: string
  telephone?: string
  enabled?: boolean
  createdAt?: string
  updatedAt?: string
  schoolId?: number
}

export interface UserResponse {
  id: number
  username: string
  email?: string
  telephone?: string
  enabled?: boolean
  roles?: string[]
  createdAt?: string
  updatedAt?: string
  schoolId?: number
}
