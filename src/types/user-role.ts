export interface UserRole {
  id: number
  userId: number
  roleId: number
  createdAt?: string
  updatedAt?: string
}

export interface UserRoleRequest {
  userId: number
  roleId: number
}

export interface UserRoleResponse {
  id: number
  userId: number
  roleId: number
  roleNom?: string
  createdAt?: string
  updatedAt?: string
}
