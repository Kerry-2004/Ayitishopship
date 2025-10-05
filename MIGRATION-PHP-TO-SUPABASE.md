# Migration de PHP/MySQL vers Supabase

## Résumé de la configuration

Votre site web AyitiShop&Ship est maintenant configuré pour communiquer avec Supabase, une plateforme de développement moderne basée sur PostgreSQL.

## Ce qui a été fait

### 1. Base de données Supabase

Toutes les tables nécessaires ont été créées dans Supabase:

- **agents** - Gestion des agents d'expédition
- **expediteurs** - Expéditeurs aux USA
- **destinataires** - Destinataires en Haïti
- **colis** - Table principale des colis
- **suivi_historique** - Historique de suivi détaillé
- **colis_photos** - Photos des colis
- **notifications** - Notifications aux clients

### 2. Configuration

- Variables d'environnement configurées dans `.env`
- Client Supabase installé et initialisé
- Types TypeScript générés pour une meilleure sécurité

### 3. Services créés

**`/src/services/colisService.ts`** - Service complet avec toutes les fonctions:

- `enregistrerColis()` - Enregistrer un nouveau colis
- `obtenirColis()` - Rechercher un colis par numéro de suivi
- `mettreAJourStatut()` - Mettre à jour le statut d'un colis
- `obtenirTousColis()` - Obtenir la liste de tous les colis

### 4. Composants React créés

**`/src/components/SuiviColisComponent.tsx`**
- Interface de suivi de colis pour les clients
- Affichage complet de l'historique
- Design moderne et responsive

**`/src/components/EnregistrementColisComponent.tsx`**
- Formulaire d'enregistrement de nouveau colis
- Validation des données
- Calcul automatique du coût et de la date d'arrivée

### 5. Sécurité (RLS)

Row Level Security activé sur toutes les tables:

- Accès public en lecture seule pour le suivi de colis
- Accès complet pour les agents authentifiés
- Protection des données sensibles

## Comment utiliser

### Pour le suivi de colis

```typescript
import { obtenirColis } from './services/colisService';

const resultat = await obtenirColis('AYITI-250105-1234');
if (resultat.success) {
  console.log(resultat.data);
}
```

### Pour enregistrer un colis

```typescript
import { enregistrerColis } from './services/colisService';

const resultat = await enregistrerColis({
  expediteur: { /* données expéditeur */ },
  destinataire: { /* données destinataire */ },
  colis: { /* données colis */ }
});
```

### Utiliser les composants React

```tsx
import { SuiviColisComponent } from './components/SuiviColisComponent';
import { EnregistrementColisComponent } from './components/EnregistrementColisComponent';

// Dans votre application
<SuiviColisComponent />
<EnregistrementColisComponent />
```

## Migration depuis PHP

### Fichiers PHP remplaçables

Ces fichiers PHP peuvent maintenant être remplacés par les services TypeScript:

- ❌ `getColis.php` → ✅ `colisService.obtenirColis()`
- ❌ `Savecolis.php` → ✅ `colisService.enregistrerColis()`
- ❌ `update_statut.php` → ✅ `colisService.mettreAJourStatut()`
- ❌ `config/database.php` → ✅ `lib/supabase.ts`
- ❌ `classes/ColisManager.php` → ✅ `services/colisService.ts`

### Avantages de Supabase vs PHP/MySQL

1. **Temps réel** - Mises à jour en temps réel des données
2. **API automatique** - Pas besoin de créer des endpoints manuellement
3. **Sécurité** - RLS intégré au niveau base de données
4. **Scalabilité** - Infrastructure cloud gérée
5. **Types TypeScript** - Meilleure sécurité du code
6. **Authentification** - Système d'auth intégré disponible

## Prochaines étapes

### 1. Authentification des agents (optionnel)

Si vous souhaitez ajouter l'authentification pour les agents:

```typescript
import { supabase } from './lib/supabase';

// Connexion
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'agent@example.com',
  password: 'password'
});

// Déconnexion
await supabase.auth.signOut();
```

### 2. Upload de photos

Pour uploader des photos de colis, vous pouvez utiliser Supabase Storage:

```typescript
const { data, error } = await supabase.storage
  .from('colis-photos')
  .upload(`${colisId}/${filename}`, file);
```

### 3. Notifications en temps réel

Pour recevoir des notifications en temps réel:

```typescript
const subscription = supabase
  .channel('colis-changes')
  .on('postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'colis' },
    (payload) => {
      console.log('Colis mis à jour:', payload);
    }
  )
  .subscribe();
```

## Tests

Pour tester la connexion à Supabase:

```typescript
import { testerConnexionSupabase, afficherStatistiques, creerColisTest }
  from './utils/testSupabase';

// Test de connexion
await testerConnexionSupabase();

// Afficher les statistiques
await afficherStatistiques();

// Créer un colis de test
await creerColisTest();
```

## Support

Pour plus d'informations:

- Documentation Supabase: https://supabase.com/docs
- Guide d'utilisation: `SUPABASE-GUIDE.md`
- Types de données: `src/lib/supabase.ts`

## Notes importantes

1. Les données existantes dans votre base MySQL ne sont PAS automatiquement migrées
2. Vous devrez exporter/importer manuellement les données si nécessaire
3. Les numéros de suivi sont maintenant au format `AYITI-YYMMDD-XXXX`
4. Tous les IDs utilisent UUID au lieu d'entiers auto-incrémentés
5. Le système est prêt à l'emploi, aucune installation serveur PHP/MySQL requise
