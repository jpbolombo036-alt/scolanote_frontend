# Plan d'alignement backend bulletin-gestion : auto-génération des champs `ordre`

## Contexte

Le frontend `scolanote` a été modifié pour calculer automatiquement les champs `ordre` / `numeroOrdre`.  
Le backend `bulletin-gestion` (Spring Boot 3.2 / Java 17 / PostgreSQL) doit être aligné pour garantir l'intégrité des données côté serveur, indépendamment du comportement du client.

## Entités concernées

| Entité | Champ | Scope d'unicité |
|--------|-------|-----------------|
| `Level` | `ordre` | `school_id` |
| `Trimester` | `ordre` | `academic_year_id` + `school_id` |
| `Period` | `ordre` | `trimester_id` + `school_id` |
| `CurriculumSubject` | `ordre` | `curriculum_id` + `school_id` |
| `Enrollment` | `numero_ordre` | `classroom_id` + `school_id` |

## Décisions

1. **Auto-génération serveur** : lors de la création (`POST`), le backend calcule `max(ordre) + 1` dans le scope et l'applique. Il ignore la valeur fournie par le client.
2. **Immuable après création** : lors de la modification (`PUT`), le backend ignore toute valeur `ordre` / `numeroOrdre` fournie. Le champ reste celui calculé à la création.
3. **Contrainte DB + retry** : une contrainte d'unicité partielle est ajoutée par table. En cas de `DataIntegrityViolationException` (concurrence), le service relance la génération (1 retry).
4. **Pas de backfill** : les enregistrements existants avec `ordre NULL` ne sont pas modifiés par migration.
5. **Tests** : ajout de tests unitaires pour chaque service couvrant la génération, l'unicité, l'immutabilité et le retry.

## Tâches

### 1. Migrations Flyway

Créer `src/main/resources/db/migration/V32__add_ordre_unique_constraints.sql` :

- `UNIQUE (school_id, ordre) WHERE ordre IS NOT NULL` sur `levels`
- `UNIQUE (academic_year_id, school_id, ordre) WHERE ordre IS NOT NULL` sur `trimesters`
- `UNIQUE (trimester_id, school_id, ordre) WHERE ordre IS NOT NULL` sur `periods`
- `UNIQUE (curriculum_id, school_id, ordre) WHERE ordre IS NOT NULL` sur `curriculum_subjects`
- `UNIQUE (classroom_id, school_id, numero_ordre) WHERE numero_ordre IS NOT NULL` sur `enrollments`

### 2. Repositories

Ajouter les méthodes de comptage nécessaires :

- `LevelRepository` : `long countBySchoolIdAndOrdre(Long schoolId, Integer ordre);`
- `TrimesterRepository` : `long countByAcademicYearIdAndSchoolIdAndOrdre(Long academicYearId, Long schoolId, Integer ordre);`
- `PeriodRepository` : `long countByTrimesterIdAndSchoolIdAndOrdre(Long trimesterId, Long schoolId, Integer ordre);`
- `CurriculumSubjectRepository` : `long countByCurriculumIdAndSchoolIdAndOrdre(Long curriculumId, Long schoolId, Integer ordre);`
- `EnrollmentRepository` : `long countByClassroomIdAndSchoolIdAndNumeroOrdre(Long classroomId, Long schoolId, Integer numeroOrdre);`

### 3. Services - logique de génération

Modifier chaque service concerné :

#### Pattern commun
```java
private Integer computeNextOrdre(scopePredicate, existingOrdre) {
    // 1. Récupérer le max dans le scope (exclure l'entité en modification si besoin)
    // 2. Si pas de max, retourner 1
    // 3. Retourner max + 1
}
```

#### Services à modifier
- `LevelService.createLevel()` : calculer `ordre` basé sur `school_id`, ignorer `request.getOrdre()`
- `TrimesterService.createTrimester()` : calculer `ordre` basé sur `academic_year_id` + `school_id`
- `PeriodService.createPeriod()` : calculer `ordre` basé sur `trimester_id` + `school_id`
- `CurriculumSubjectService.createCurriculumSubject()` : calculer `ordre` basé sur `curriculum_id` + `school_id`
- `EnrollmentService.createEnrollment()` : calculer `numeroOrdre` basé sur `classroom_id` + `school_id`

#### Retry
Ajouter une logique de retry (max 2 tentatives) sur `DataIntegrityViolationException` lors de la sauvegarde.

### 4. Services - immutabilité en PUT

Dans chaque `updateXxx()` :
- Ignorer le champ `ordre` / `numeroOrdre` du request.
- S'assurer que la valeur existante n'est pas écrasée.

### 5. DTOs

- Marquer `ordre` / `numeroOrdre` comme optionnels dans les Request DTOs (ils le sont déjà, mais vérifier).
- Ajouter des commentaires JavaDoc indiquant que ces champs sont auto-générés et ignorés en création/modification.

### 6. Controllers

Aucun changement fonctionnel nécessaire (les endpoints restent identiques), mais :
- Mettre à jour les Swagger `@Operation` pour indiquer que `ordre` est auto-généré.

### 7. Tests unitaires

Ajouter des tests dans `src/test/java/...` pour chaque service :

- Génération séquentielle (`1, 2, 3...`)
- Unicité respectée
- Ignore la valeur client en POST
- Ignore la valeur client en PUT
- Retry en cas de conflit simulé

Couverture cible : services `LevelService`, `TrimesterService`, `PeriodService`, `CurriculumSubjectService`, `EnrollmentService`.

## Risques

- **Race condition** : atténuée par la contrainte DB + retry (1 tentative supplémentaire).
- **Données existantes** : les `ordre NULL` existants ne sont pas touchés. Les listes paginées peuvent retourner `null` pour ce champ.
- **Performance** : les requêtes `MAX(ordre)` sont indexées par les contraintes d'unicité (PostgreSQL crée automatiquement un index pour les contraintes uniques).

## Validation

- `./mvnw test` passe (nouveaux tests unitaires).
- `./mvnw spring-boot:run` avec profile `local` fonctionne (H2 + H2 console).
- Vérifier manuellement via Swagger que les POST créent bien avec `ordre` auto-généré.
- Vérifier que les PUT ne modifient pas `ordre`.
