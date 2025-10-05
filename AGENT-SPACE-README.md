# Agent Space - AyitiShop&Ship

## Vue d'ensemble

L'Agent Space est un système complet de gestion de colis pour les agents d'AyitiShop&Ship, intégré à Supabase pour des mises à jour en temps réel.

## Fonctionnalités

### Authentification
- ✅ Connexion sécurisée avec email et mot de passe
- ✅ Gestion des sessions avec Supabase Auth
- ✅ Redirection automatique si non authentifié
- ✅ Déconnexion sécurisée

### Dashboard Principal
- ✅ Vue d'ensemble avec statistiques en temps réel
- ✅ Total des colis enregistrés
- ✅ Total des clients
- ✅ Répartition par statut (graphiques)
- ✅ Derniers colis enregistrés
- ✅ Mises à jour automatiques en temps réel

### Enregistrement de Colis
- ✅ Formulaire complet pour nouveaux colis
- ✅ Informations expéditeur (USA)
- ✅ Informations destinataire (Haïti)
- ✅ Détails du colis (poids, type, description)
- ✅ Calcul automatique du coût d'expédition
- ✅ Génération automatique du numéro de suivi
- ✅ Estimation de la date d'arrivée
- ✅ Notifications automatiques

### Scanner QR
- ✅ Scanner intégré compatible mobile/desktop
- ✅ Activation de la caméra en temps réel
- ✅ Saisie manuelle du numéro de suivi
- ✅ Mise à jour rapide du statut
- ✅ Ajout de localisation et commentaires
- ✅ Notifications automatiques au client

### Historique
- ✅ Liste complète de tous les colis
- ✅ Recherche par numéro, nom, ville
- ✅ Filtrage par statut
- ✅ Tri par date
- ✅ Vue tableau responsive

## Structure des fichiers

```
src/
├── pages/
│   ├── AgentLogin.tsx          # Page de connexion
│   └── AgentDashboard.tsx      # Dashboard principal
├── components/
│   └── agent/
│       ├── StatistiquesDashboard.tsx  # Statistiques et graphiques
│       ├── EnregistrementColis.tsx    # Formulaire d'enregistrement
│       ├── ScannerQR.tsx              # Scanner QR intégré
│       └── HistoriqueColis.tsx        # Historique avec recherche
├── services/
│   ├── authService.ts          # Authentification
│   ├── colisService.ts         # Gestion des colis
│   └── statistiquesService.ts  # Statistiques en temps réel
└── lib/
    └── supabase.ts             # Client Supabase
```

## URLs

- `/agent-space` - Page de connexion
- `/agent-space/dashboard` - Dashboard principal (protégé)

## Utilisation

### 1. Créer un compte agent

Suivez les instructions dans `CREATE-AGENT-ACCOUNT.md`

### 2. Se connecter

1. Accédez à `/agent-space`
2. Entrez vos identifiants
3. Cliquez sur "Se connecter"

### 3. Enregistrer un colis

1. Cliquez sur l'onglet "Enregistrer colis"
2. Remplissez les informations de l'expéditeur
3. Remplissez les informations du destinataire
4. Ajoutez les détails du colis
5. Cliquez sur "Enregistrer le colis"
6. Un numéro de suivi est généré automatiquement

### 4. Scanner un colis

1. Cliquez sur l'onglet "Scanner QR"
2. Cliquez sur "Activer la caméra"
3. Scannez le code QR ou saisissez le numéro manuellement
4. Sélectionnez le nouveau statut
5. Ajoutez une localisation et un commentaire (optionnel)
6. Cliquez sur "Mettre à jour le statut"

### 5. Consulter l'historique

1. Cliquez sur l'onglet "Historique"
2. Utilisez la recherche pour filtrer
3. Utilisez le filtre de statut
4. Cliquez sur "Actualiser" pour recharger

## Statuts disponibles

- **En attente** - Colis enregistré, en attente d'expédition
- **En transit** - Colis en cours d'acheminement
- **Arrivé au bureau** - Colis arrivé en Haïti
- **Prêt à récupérer** - Colis prêt pour le client
- **Récupéré** - Colis récupéré par le client

## Mises à jour en temps réel

Le système utilise Supabase Realtime pour:
- Mettre à jour automatiquement les statistiques
- Actualiser la liste des colis récents
- Synchroniser les changements entre agents

## Responsive Design

L'interface s'adapte automatiquement:
- 📱 **Mobile** - Interface tactile optimisée
- 📱 **Tablette** - Layout adapté
- 💻 **Desktop** - Vue complète

## Scanner QR - Compatibilité

### Mobile
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Android Firefox

### Desktop
- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ⚠️ Safari (nécessite permissions)

### Permissions requises
- Accès à la caméra
- HTTPS requis en production

## Sécurité

### Authentification
- Mots de passe hashés avec Supabase Auth
- Sessions sécurisées avec tokens JWT
- Expiration automatique des sessions

### Base de données
- Row Level Security (RLS) activé
- Accès restreint aux agents authentifiés
- Audit trail complet

### HTTPS
- Obligatoire en production
- Requis pour le scanner QR
- Certificat SSL automatique avec Vercel/Netlify

## Performance

- Bundle size optimisé
- Lazy loading des composants
- Debouncing sur la recherche
- Pagination automatique (si nécessaire)

## Déploiement

### Vercel (Recommandé)

```bash
npm install -g vercel
vercel login
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Variables d'environnement

Les variables sont déjà configurées dans `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Développement

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Builder pour la production
npm run build
```

## Dépannage

### "Session expired"
- Reconnectez-vous
- Vérifiez la validité de votre compte

### "Camera permission denied"
- Autorisez l'accès à la caméra dans les paramètres du navigateur
- Utilisez HTTPS (requis pour la caméra)

### "Failed to update"
- Vérifiez votre connexion internet
- Vérifiez que le numéro de suivi est correct
- Actualisez la page

### Les statistiques ne se mettent pas à jour
- Vérifiez que Supabase Realtime est activé
- Actualisez la page manuellement
- Vérifiez les logs de la console

## Support

Pour obtenir de l'aide:
1. Consultez la documentation Supabase
2. Vérifiez les logs de la console (F12)
3. Contactez l'administrateur système

## Mises à jour futures

- [ ] Notifications push
- [ ] Export Excel/PDF
- [ ] Impression d'étiquettes
- [ ] Upload de photos de colis
- [ ] Chat entre agents
- [ ] Rapports avancés

## Version

- **Version**: 1.0.0
- **Date**: 2025-10-05
- **Statut**: ✅ Production Ready
