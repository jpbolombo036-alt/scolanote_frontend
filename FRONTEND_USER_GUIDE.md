# ScolaNote - Guide utilisateur frontend

Ce document décrit l'utilisation du frontend ScolaNote pour les testeurs et les utilisateurs finaux. Il couvre l'installation, le démarrage, les actions clés et des exemples concrets pour valider les principales fonctionnalités.

---

## 1. Objectif

Ce guide permet aux utilisateurs finaux de tester le frontend ScolaNote sur un environnement local ou une instance déployée. Il aide à vérifier les fonctionnalités suivantes :

- Authentification et navigation
- Gestion des écoles, années, trimestres, périodes et classes
- Gestion des matières, professeurs, élèves et inscriptions
- Création d'évaluations et de notes
- Génération et consultation de bulletins
- Mode sombre et expérience utilisateur

---

## 2. Prérequis

### 2.1. Outils

- Node.js 18+ installé
- npm ou yarn
- Backend ScolaNote démarré et accessible
- Un navigateur récent (Chrome, Edge, Firefox)

### 2.2. Configuration

Le frontend utilise une API backend configurée via les variables d'environnement de Vite.

- Copier `.env.example` vers `.env`
- Mettre à jour la variable :

```env
VITE_API_BASE_URL=http://localhost:8000
```

Si l'API est déployée, remplacer l'URL par l'URL fournie.

---

## 3. Démarrage du frontend

Depuis le dossier `scolanote` :

```bash
npm install
npm run dev
```

Le frontend s'ouvre normalement sur :

- `http://localhost:5173`

---

## 4. Connexion

### 4.1. Page de connexion

Accéder à `/login` depuis l'application.

### 4.2. Champs

- Nom d'utilisateur
- Mot de passe

> Utiliser les identifiants fournis par l'administrateur ou les données de test du backend.

### 4.3. Tests

1. Tenter une connexion avec des identifiants incorrects : vérifier l'affichage d'une erreur.
2. Se connecter avec des identifiants valides : vérifier la redirection vers le tableau de bord.

---

## 5. Tableau de bord

Une fois connecté, vous arrivez sur la page `Dashboard`.

### 5.1. Vérifier

- Statistiques générales
- Derniers bulletins
- Carte de navigation rapide

### 5.2. Exemple de test

- Vérifier que les cartes s'affichent correctement.
- Vérifier le tableau `Derniers bulletins`.
- Tester le mode sombre depuis le bouton de l'en-tête ou sur mobile.

---

## 6. Navigation principale

Le menu principal contient généralement les sections suivantes :

- Écoles
- Années scolaires
- Trimestres
- Périodes
- Classes
- Programmes
- Matières
- Enseignants
- Élèves
- Inscriptions
- Attributions
- Types d'évaluations
- Évaluations
- Notes
- Bulletins
- Utilisateurs
- Rôles

### 6.1. Sidebar desktop

Le menu latéral doit être lisible en mode sombre et clair.

### 6.2. Menu mobile

Le menu doit s'ouvrir et se fermer correctement sur mobile.

---

## 7. Tests d'usage des pages métier

### 7.1. Écoles

- Ajouter une nouvelle école
- Modifier une école existante
- Vérifier l'enregistrement

### 7.2. Années scolaires

- Créer une année scolaire
- Modifier une année scolaire
- Vérifier la présence dans la liste

### 7.3. Trimestres

- Ajouter un trimestre
- Vérifier la liste

### 7.4. Périodes

- Ajouter une période
- Vérifier la liste

### 7.5. Classes

- Créer / modifier une salle (classe)
- Vérifier l'affichage

### 7.6. Programmes et matières

- Ajouter un programme
- Ajouter une matière liée au programme
- Vérifier la liste

### 7.7. Enseignants

- Créer un professeur
- Modifier un professeur
- Vérifier l'affichage

### 7.8. Élèves

- Créer un élève
- Modifier un élève
- Vérifier l'affichage

### 7.9. Inscriptions

- Ajouter une inscription d'élève
- Vérifier qu'elle apparaît dans la liste

### 7.10. Attributions

- Créer une attribution de professeur
- Vérifier l’impact sur la liste

### 7.11. Évaluations

- Créer une évaluation
- Associer l'évaluation à une matière / une classe
- Vérifier la liste

### 7.12. Notes

- Créer une note pour un élève
- Modifier une note
- Vérifier le résultat

---

## 8. Bulletins scolaires

### 8.1. Génération de bulletin

Accéder à la page `Générer un bulletin`.

#### Exemple

- Choisir une `Classe`
- Choisir une `Période`
- Cliquer sur `Générer`

### 8.2. Vérifier

- Aucune erreur 500 côté frontend
- Message d'erreur clair si le backend renvoie un problème
- Redirection vers `/bulletins` après succès

### 8.3. Consultation

- Ouvrir un bulletin existant
- Vérifier la fiche détaillée
- Télécharger le PDF si disponible

---

## 9. Mode sombre

### 9.1. Test

- Activer/désactiver le mode sombre depuis l'en-tête
- Vérifier l'apparence de :
  - sidebar
  - cartes
  - tableaux
  - formulaires
  - modales

### 9.2. Points importants

- Les bordures doivent rester sombres
- Les fonds de cartes doivent être homogènes
- Les textes doivent rester lisibles

---

## 10. Scénarios de test recommandés

### 10.1. Scénario de base

1. Se connecter
2. Vérifier le tableau de bord
3. Créer une année scolaire
4. Créer un trimestre
5. Créer une période
6. Créer une classe
7. Créer un élève
8. Inscrire l'élève
9. Générer un bulletin
10. Consulter le bulletin

### 10.2. Scénario de qualité UI

1. Bascule mode sombre / clair
2. Ouvrir le menu mobile
3. Vérifier les éléments du menu
4. Vérifier les boutons bleus et les boutons de confirmation
5. Vérifier les erreurs de formulaire

### 10.3. Scénario de validation des données

1. Tenter une création avec un champ obligatoire vide
2. Vérifier le message d'erreur
3. Tenter une connexion invalide
4. Vérifier le message de validation

---

## 11. Résolution des problèmes courants

### 11.1. Le frontend ne démarre pas

- Vérifier l'installation des dépendances : `npm install`
- Vérifier la version de Node.js
- Vérifier le fichier `.env`

### 11.2. Erreur 500 lors de la génération du bulletin

- Vérifier que le backend fonctionne
- Vérifier que les IDs sélectionnés sont valides
- Vérifier l'erreur affichée dans le composant

### 11.3. Erreur 401 / redirection vers la page de login

- Vérifier le token stocké dans `localStorage`
- Se reconnecter

---

## 12. Commandes utiles

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
```

---

## 13. Exemple d'utilisation pour un testeur

1. `npm install`
2. `npm run dev`
3. Ouvrir `http://localhost:5173`
4. Se connecter avec un compte administrateur
5. Créer une année scolaire, un trimestre et une période
6. Créer une classe, un professeur et un élève
7. Inscrire l'élève dans la classe
8. Générer un bulletin pour cette classe et cette période
9. Consulter le bulletin et vérifier la mise en page
10. Activer le mode sombre et vérifier les bordures

---

## 14. Remarques

- Ce guide est destiné aux testeurs frontend et aux utilisateurs internes.
- Toute anomalie doit être signalée avec l'étape exacte, la page utilisée et le message d'erreur affiché.
- Si un écran ne correspond pas aux attentes en mode sombre, noter le composant affecté.
