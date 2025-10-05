# Guide d'intégration Supabase - AyitiShop&Ship

## Configuration

La base de données Supabase est maintenant configurée et prête à l'emploi. Les variables d'environnement sont déjà définies dans le fichier `.env`.

## Structure de la base de données

### Tables créées

1. **agents** - Gestion des agents d'expédition
2. **expediteurs** - Informations des expéditeurs (USA)
3. **destinataires** - Informations des destinataires (Haïti)
4. **colis** - Table principale des colis
5. **suivi_historique** - Historique de suivi des colis
6. **colis_photos** - Photos des colis
7. **notifications** - Notifications aux clients

## Utilisation des services

### Importer les services

```typescript
import {
  enregistrerColis,
  obtenirColis,
  mettreAJourStatut,
  obtenirTousColis
} from './src/services/colisService';
```

### Enregistrer un nouveau colis

```typescript
const resultat = await enregistrerColis({
  expediteur: {
    nom_complet: "John Doe",
    telephone: "+1234567890",
    email: "john@example.com",
    adresse_complete: "123 Main St",
    ville: "Miami",
    etat: "FL",
    code_postal: "33101"
  },
  destinataire: {
    nom_complet: "Marie Dupont",
    telephone: "+50912345678",
    email: "marie@example.com",
    ville_recuperation: "Port-au-Prince",
    adresse_complete: "45 Rue Example"
  },
  colis: {
    type_colis: "Colis standard",
    poids_lbs: 15.5,
    description_detaillee: "Vêtements et accessoires",
    quantite_articles: 3,
    instructions_speciales: "Fragile"
  }
});

if (resultat.success) {
  console.log('Numéro de suivi:', resultat.numero_suivi);
  console.log('Coût:', resultat.cout_expedition);
  console.log('Date prévue:', resultat.date_prevue_arrivee);
}
```

### Rechercher un colis

```typescript
const resultat = await obtenirColis('AYITI-250105-1234');

if (resultat.success) {
  console.log('Colis:', resultat.data);
  console.log('Historique:', resultat.data.historique);
  console.log('Photos:', resultat.data.photos);
}
```

### Mettre à jour le statut d'un colis

```typescript
const resultat = await mettreAJourStatut(
  'AYITI-250105-1234',
  'en_transit',
  'agent-id-uuid',
  'Colis chargé dans le conteneur',
  'Miami - Port de départ'
);

if (resultat.success) {
  console.log('Statut mis à jour avec succès');
}
```

### Obtenir tous les colis

```typescript
const resultat = await obtenirTousColis();

if (resultat.success) {
  console.log('Nombre de colis:', resultat.data.length);
  resultat.data.forEach(colis => {
    console.log(colis.numero_suivi, colis.statut);
  });
}
```

## Statuts disponibles

- `en_attente` - Colis enregistré, en attente d'expédition
- `en_transit` - Colis en transit vers Haïti
- `arrive_bureau` - Colis arrivé au bureau en Haïti
- `pret_recuperation` - Colis prêt à être récupéré
- `recupere` - Colis récupéré par le destinataire

## Sécurité (RLS)

Les politiques de sécurité Row Level Security (RLS) sont activées:

- Les utilisateurs anonymes peuvent consulter les colis publiquement (pour le suivi)
- Les agents authentifiés ont accès complet aux opérations CRUD
- Chaque agent ne peut voir que son propre profil

## Migration depuis l'ancien système PHP

Pour migrer depuis votre système PHP actuel vers Supabase:

1. Les fichiers PHP existants peuvent être remplacés par les appels aux services TypeScript
2. Les endpoints API (`getColis.php`, `Savecolis.php`) peuvent être supprimés
3. Utilisez directement les fonctions du service `colisService.ts`

## Client Supabase

Le client Supabase est initialisé dans `/src/lib/supabase.ts` et peut être importé dans n'importe quel fichier:

```typescript
import { supabase } from './lib/supabase';

// Exemple de requête personnalisée
const { data, error } = await supabase
  .from('colis')
  .select('*')
  .eq('statut', 'en_attente');
```

## Types TypeScript

Les types de base de données sont définis dans `/src/lib/supabase.ts` pour une meilleure sécurité de type.
