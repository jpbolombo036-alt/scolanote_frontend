# Plan d'alignement backend bulletin-gestion : auto-génération des champs `ordre`

## Constat

Le backend `bulletin-gestion` **implémente déjà** la logique d'auto-génération des champs `ordre` / `numeroOrdre`. Le frontend `scolanote` a été modifié pour ne plus envoyer ces champs manuellement ; le backend est prêt à recevoir ces appels.

## État actuel (déjà en place)

| Composant | État |
|-----------|------|
| `AutoOrdreService` + `AutoOrdreRetry` | Existent, utilisent `REQUIRES_NEW` + retry sur `DataIntegrityViolationException` |
| `LevelService` | Utilise `AutoOrdreRetry`, `ordre` immuable en PUT |
| `TrimesterService` | Utilise `AutoOrdreRetry`, `ordre` immuable en PUT |
| `PeriodService` | Utilise `AutoOrdreRetry`, `ordre` immuable en PUT |
| `CurriculumSubjectService` | Utilise `AutoOrdreRetry`, `ordre` immuable en PUT |
| `EnrollmentService` | Utilise `AutoOrdreRetry`, `numeroOrdre` immuable en PUT |
| Repositories | Tous exposent `maxOrdre...` + `countBy...AndOrdre` |
| Migration V32 | Ajoute les contraintes d'unicité partielles + déduplication + backfill `school_id` sur `curriculum_subjects` |
| DTOs | Tous ont un JavaDoc indiquant que `ordre`/`numeroOrdre` est ignoré par le serveur |
| Tests | `LevelServiceTest`, `TrimesterServiceTest`, `PeriodServiceTest`, `CurriculumSubjectServiceTest`, `EnrollmentServiceTest` existent et couvrent : génération, scope vide, immutabilité PUT, retry conflit |

## Vérification recommandée

1. **Lancer les tests** : `./mvnw test`
2. **Lancer en local** : `./mvnw spring-boot:run` avec profile `local` (H2, Flyway désactivé)
3. **Vérifier via Swagger** : POST sur `/api/niveaux`, `/api/trimestres`, `/api/periodes`, `/api/matieres-programme`, `/api/inscriptions` → l'`ordre` est bien calculé côté serveur
4. **Vérifier les PUT** : envoyer un `ordre` différent dans le body → la valeur existante est conservée

## Risques résiduels

- **Données existantes** : les enregistrements avec `ordre NULL` ne sont pas touchés (pas de backfill).
- **Race condition** : gérée par contrainte DB + retry (2 tentatives max).
- **Concurrence forte** : au-delà de 2 insertions simultanées dans le même scope, le retry peut échouer et remonter une erreur 500.

## Conclusion

Aucun code supplémentaire n'est requis. Le backend est déjà aligné avec le frontend pour l'auto-génération des ordres.
