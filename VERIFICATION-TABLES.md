# Vérification des tables Supabase - AyitiShop&Ship

## ✅ Configuration validée

Toutes les tables ont été créées avec succès dans Supabase.

## Tables créées (7/7)

### ✅ 1. agents
- **Colonnes**: 10
- **RLS**: Activé
- **Clé primaire**: id (UUID)
- **Relations**: Référencé par `colis` et `suivi_historique`

### ✅ 2. expediteurs
- **Colonnes**: 9
- **RLS**: Activé
- **Clé primaire**: id (UUID)
- **Relations**: Référencé par `colis`

### ✅ 3. destinataires
- **Colonnes**: 7
- **RLS**: Activé
- **Clé primaire**: id (UUID)
- **Relations**: Référencé par `colis`

### ✅ 4. colis
- **Colonnes**: 18
- **RLS**: Activé
- **Clé primaire**: id (UUID)
- **Index uniques**: numero_suivi, qr_code
- **Contraintes**:
  - poids_lbs > 0
  - quantite_articles > 0
  - cout_expedition >= 0
  - statut dans ['en_attente', 'en_transit', 'arrive_bureau', 'pret_recuperation', 'recupere']
- **Relations**:
  - Référence `expediteurs`, `destinataires`, `agents`
  - Référencé par `suivi_historique`, `colis_photos`, `notifications`

### ✅ 5. suivi_historique
- **Colonnes**: 8
- **RLS**: Activé
- **Clé primaire**: id (UUID)
- **Relations**: Référence `colis` et `agents`

### ✅ 6. colis_photos
- **Colonnes**: 6
- **RLS**: Activé
- **Clé primaire**: id (UUID)
- **Contraintes**: taille_fichier > 0
- **Relations**: Référence `colis`

### ✅ 7. notifications
- **Colonnes**: 10
- **RLS**: Activé
- **Clé primaire**: id (UUID)
- **Contraintes**: type_notification dans ['enregistrement', 'transit', 'arrive', 'pret_recuperation']
- **Relations**: Référence `colis`

## Index créés

Les index suivants ont été créés pour optimiser les performances:

1. `idx_colis_numero_suivi` - Index sur numero_suivi
2. `idx_colis_qr_code` - Index sur qr_code
3. `idx_colis_statut` - Index sur statut
4. `idx_colis_expediteur` - Index sur expediteur_id
5. `idx_colis_destinataire` - Index sur destinataire_id
6. `idx_suivi_colis` - Index sur colis_id dans suivi_historique
7. `idx_photos_colis` - Index sur colis_id dans colis_photos
8. `idx_notifications_colis` - Index sur colis_id dans notifications
9. `idx_notifications_envoyee` - Index sur envoyee dans notifications

## Politiques RLS (Row Level Security)

### Table: agents
- Lecture: Agents authentifiés peuvent lire leur propre profil
- Mise à jour: Agents authentifiés peuvent mettre à jour leur propre profil

### Table: expediteurs
- Lecture: Agents authentifiés
- Insertion: Agents authentifiés
- Mise à jour: Agents authentifiés

### Table: destinataires
- Lecture: Agents authentifiés
- Insertion: Agents authentifiés
- Mise à jour: Agents authentifiés

### Table: colis
- Lecture: Tout le monde (public + authentifié) pour le suivi
- Insertion: Agents authentifiés
- Mise à jour: Agents authentifiés
- Suppression: Agents authentifiés

### Table: suivi_historique
- Lecture: Tout le monde (public + authentifié)
- Insertion: Agents authentifiés

### Table: colis_photos
- Lecture: Agents authentifiés
- Insertion: Agents authentifiés
- Suppression: Agents authentifiés

### Table: notifications
- Lecture: Agents authentifiés
- Insertion: Agents authentifiés
- Mise à jour: Agents authentifiés

## Relations entre tables

```
agents
  ↓ (agent_enregistrement_id)
colis ←───────────────────────┐
  ↓ (expediteur_id)           │
expediteurs                   │
                              │
colis                         │
  ↓ (destinataire_id)         │
destinataires                 │
                              │
colis ────────────────────────┤
  ↓ (colis_id)                │
suivi_historique              │
  ↓ (agent_id)                │
agents                        │
                              │
colis ────────────────────────┤
  ↓ (colis_id)                │
colis_photos                  │
                              │
colis ────────────────────────┘
  ↓ (colis_id)
notifications
```

## Valeurs par défaut

### Table: agents
- role: 'agent'
- bureau_localisation: ''
- actif: true
- date_creation: now()

### Table: expediteurs
- adresse_complete: ''
- ville: ''
- etat: ''
- code_postal: ''
- date_creation: now()

### Table: destinataires
- adresse_complete: ''
- date_creation: now()

### Table: colis
- quantite_articles: 1
- statut: 'en_attente'
- date_enregistrement: now()

### Table: suivi_historique
- localisation: ''
- commentaire: ''
- date_scan: now()

### Table: colis_photos
- date_upload: now()

### Table: notifications
- envoyee: false
- date_creation: now()

## Cascade et actions

- **ON DELETE CASCADE**:
  - expediteurs → colis
  - destinataires → colis
  - colis → suivi_historique
  - colis → colis_photos
  - colis → notifications

- **ON DELETE SET NULL**:
  - agents → colis (agent_enregistrement_id)
  - agents → suivi_historique (agent_id)

## Statistiques

- **Total de colonnes**: 78
- **Total de relations**: 9
- **Total de contraintes**: 8
- **Total d'index**: 9+
- **Total de politiques RLS**: 20+

## Prochaine étape

Le système est maintenant prêt à être utilisé. Vous pouvez:

1. Tester la connexion avec `src/utils/testSupabase.ts`
2. Utiliser les services dans `src/services/colisService.ts`
3. Intégrer les composants React dans votre application
4. Migrer les données existantes si nécessaire

## Version de la base de données

- **Date de création**: 2025-10-05
- **Migration**: create_ayitishopship_schema
- **Statut**: ✅ Opérationnel
