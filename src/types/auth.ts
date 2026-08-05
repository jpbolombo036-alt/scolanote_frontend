export interface RegisterAgentRequest {
  username?: string
  email?: string
  telephone?: string
  password: string
  role: string
}

export interface RegisterAgentResponse {
  id: number
  username: string
  email?: string
  telephone?: string
  role: string
  schoolId?: number
  message: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  newPassword: string
}

export interface CurrentUserResponse {
  id: number
  username: string
  enabled: boolean
  roles: string[]
  schoolId?: number
}

export interface ProfileUpdateRequest {
  username?: string
  email?: string
  telephone?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}