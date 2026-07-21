export interface School {
  id: number
  nom: string
  code: string
  province: string
  communeTerritoire: string
  adresse?: string
  telephone?: string
  email: string
  logo?: string
  createdAt?: string
  updatedAt?: string
}

export interface SchoolRequest {
  nom: string
  code: string
  province: string
  communeTerritoire: string
  adresse?: string
  telephone?: string
  email: string
  logo?: string
}

export interface SchoolResponse {
  id: number
  nom: string
  code: string
  province: string
  communeTerritoire: string
  adresse?: string
  telephone?: string
  email: string
  logo?: string
  createdAt?: string
  updatedAt?: string
}
