export interface Student {
  id: number
  matricule: string
  nom: string
  postnom?: string
  prenom?: string
  sexe?: string
  dateNaissance?: string
  lieuNaissance?: string
  adresse?: string
  telephoneParent?: string
  emailParent?: string
  etat: string
  createdAt?: string
  updatedAt?: string
}

export interface StudentRequest {
  matricule: string
  nom: string
  postnom?: string
  prenom?: string
  sexe?: string
  dateNaissance?: string
  lieuNaissance?: string
  adresse?: string
  telephoneParent?: string
  emailParent?: string
  etat?: string
}

export interface StudentResponse {
  id: number
  matricule: string
  nom: string
  postnom?: string
  prenom?: string
  sexe?: string
  dateNaissance?: string
  lieuNaissance?: string
  adresse?: string
  telephoneParent?: string
  emailParent?: string
  etat: string
  createdAt?: string
  updatedAt?: string
}
