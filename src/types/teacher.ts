export interface Teacher {
  id: number
  nom: string
  postnom?: string
  prenom?: string
  specialite?: string
  telephone?: string
  email?: string
  dateNaissance?: string
  lieuNaissance?: string
  adresse?: string
  etat?: string
  createdAt?: string
  updatedAt?: string
}

export interface TeacherRequest {
  nom: string
  postnom?: string
  prenom?: string
  specialite?: string
  telephone?: string
  email?: string
  dateNaissance?: string
  lieuNaissance?: string
  adresse?: string
  etat?: string
}

export interface TeacherResponse {
  id: number
  nom: string
  postnom?: string
  prenom?: string
  specialite?: string
  telephone?: string
  email?: string
  dateNaissance?: string
  lieuNaissance?: string
  adresse?: string
  etat?: string
  createdAt?: string
  updatedAt?: string
}
