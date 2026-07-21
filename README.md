# ScolaNote - Gestion des Bulletins Scolaires

Application de gestion des bulletins scolaires pour les écoles en République Démocratique du Congo (RDC).

## Stack

- **Framework** : Vue 3 (Composition API)
- **Langage** : TypeScript
- **Bundler** : Vite
- **UI** : Tailwind CSS
- **State** : Pinia
- **Router** : Vue Router 4
- **HTTP** : Axios

## Installation

```bash
npm install
```

## Configuration

Copier `.env.example` vers `.env` et ajuster les variables:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_TITLE=ScolaNote
```

## Scripts

```bash
npm run dev        # Démarre le serveur de développement
npm run build      # Build de production
npm run preview    # Prévisualise le build
npm run lint       # Lint le code
```

## Structure du projet

```
src/
├── main.ts                 # Point d'entrée
├── App.vue                 # Layout global + RouterView
├── config/env.ts           # Variables d'environnement typées
├── types/                  # Interfaces TypeScript
├── api/                    # Modules Axios
├── stores/                 # Stores Pinia
├── composables/            # Composables réutilisables
├── layouts/                # Layouts Auth + Main
├── pages/                  # Pages de l'application
├── components/             # Composants réutilisables
├── router/                 # Configuration Vue Router
├── utils/                  # Utilitaires
└── assets/styles/          # Styles globaux
```

## Backend

Le backend Spring Boot doit être lancé sur `http://localhost:8000`.

## Authentification

L'application utilise JWT avec stockage dans localStorage.
# scolanote_frontend
