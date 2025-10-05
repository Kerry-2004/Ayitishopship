# 🚀 Démarrage Rapide - Agent Space

## ✅ Configuration terminée

Votre application Agent Space est configurée et connectée à votre base de données Supabase réelle.

## 📋 Étapes pour commencer

### 1️⃣ Créer les tables dans Supabase (5 minutes)

1. Allez sur https://supabase.com/dashboard
2. Connectez-vous et ouvrez votre projet
3. Cliquez sur **SQL Editor** (menu gauche)
4. Ouvrez le fichier `supabase/migrations/create_tables.sql`
5. Copiez tout le contenu
6. Collez dans l'éditeur SQL de Supabase
7. Cliquez sur **Run** ✅

**Résultat**: 7 tables créées avec sécurité RLS activée

### 2️⃣ Créer votre compte agent (3 minutes)

#### Dans Supabase Dashboard:

**A. Créer l'utilisateur dans Auth:**
- **Authentication** → **Users** → **Add user**
- Email: `admin@ayitishopship.com`
- Password: `Admin123456!`
- ✅ **Auto Confirm User**: OUI (important!)
- Cliquez sur **Create user**
- 📝 **Notez l'UUID** de l'utilisateur créé

**B. Ajouter l'agent dans la table:**
- **Table Editor** → **agents** → **Insert row**
- Remplissez:
  - `id`: Collez l'UUID noté ci-dessus
  - `nom_complet`: "Administrateur"
  - `email`: "admin@ayitishopship.com"
  - `mot_de_passe`: "temp" (sera ignoré par Supabase Auth)
  - `telephone`: "+15082463522"
  - `role`: "admin"
  - `bureau_localisation`: "Miami"
  - `actif`: true
- Cliquez sur **Save**

### 3️⃣ Lancer l'application (1 minute)

```bash
# Dans le terminal
npm run dev
```

**Résultat**: Serveur lancé sur http://localhost:5173

### 4️⃣ Se connecter à l'Agent Space

1. Ouvrez votre navigateur
2. Allez sur: `http://localhost:5173/agent-space`
3. Connectez-vous avec:
   - Email: `admin@ayitishopship.com`
   - Password: `Admin123456!`
4. 🎉 **Vous êtes dans le Dashboard!**

## 📊 Tester les fonctionnalités

### Enregistrer un colis de test

1. Cliquez sur l'onglet **"Enregistrer colis"**
2. Remplissez les informations:

   **Expéditeur (USA):**
   - Nom: John Doe
   - Téléphone: +15551234567
   - Email: john@test.com
   - Ville: Miami
   - État: FL
   - Adresse: 123 Main St

   **Destinataire (Haïti):**
   - Nom: Marie Dupont
   - Téléphone: +50912345678
   - Email: marie@test.com
   - Ville: Port-au-Prince
   - Adresse: 45 Rue Test

   **Colis:**
   - Type: Colis standard
   - Poids: 10 lbs
   - Description: Test de colis
   - Quantité: 1

3. Cliquez sur **"Enregistrer le colis"**
4. ✅ Un numéro de suivi est généré automatiquement!

### Mettre à jour le statut

1. Cliquez sur l'onglet **"Scanner QR"**
2. Entrez le numéro de suivi du colis créé
3. Sélectionnez: "En transit"
4. Localisation: "Miami - En route"
5. Commentaire: "Colis chargé dans l'avion"
6. Cliquez sur **"Mettre à jour le statut"**
7. ✅ Le statut est mis à jour en temps réel!

### Voir les statistiques

1. Retournez sur l'onglet **"Tableau de bord"**
2. Vous verrez:
   - Total colis: 1
   - Répartition par statut
   - Dernier colis enregistré
3. Les statistiques se mettent à jour automatiquement!

## 🎯 Fonctionnalités disponibles

### ✅ Dashboard
- Statistiques en temps réel
- Graphiques de répartition
- Derniers colis enregistrés

### ✅ Enregistrement
- Formulaire complet
- Calcul automatique des coûts
- Génération du numéro de suivi

### ✅ Scanner QR
- Scan avec caméra (mobile/desktop)
- Saisie manuelle
- Mise à jour instantanée

### ✅ Historique
- Liste complète
- Recherche avancée
- Filtrage par statut

## 📱 Test sur mobile

1. Sur votre ordinateur, notez l'adresse IP locale
2. Sur mobile, connectez-vous au même WiFi
3. Accédez à: `http://[IP_ORDINATEUR]:5173/agent-space`
4. Testez le scanner QR avec la caméra!

## 🔗 URLs de l'application

| Route | Description |
|-------|-------------|
| `/` | Redirige vers /suivi |
| `/suivi` | Suivi public des colis |
| `/agent-space` | Connexion agents |
| `/agent-space/dashboard` | Dashboard complet |

## 📊 Données de test

Après avoir créé votre premier colis, vous pouvez:

1. Le rechercher dans l'historique
2. Modifier son statut plusieurs fois
3. Voir l'historique complet des changements
4. Tester le suivi public sur `/suivi`

## 🐛 En cas de problème

### "relation does not exist"
➡️ Exécutez le SQL de migration dans Supabase

### "Invalid credentials"
➡️ Vérifiez que l'utilisateur existe dans Auth ET dans la table agents

### "Cannot find module"
```bash
npm install
npm run dev
```

### Les statistiques ne s'affichent pas
➡️ Actualisez la page (F5)

## 🎨 Personnalisation

Vous pouvez modifier:
- Les villes de destination dans `EnregistrementColis.tsx`
- Les tarifs d'expédition dans `colisService.ts`
- Les statuts disponibles dans tout le code

## 📖 Documentation complète

- `AGENT-SPACE-README.md` - Guide utilisateur détaillé
- `CONFIGURATION-DATABASE.md` - Setup base de données
- `CREATE-AGENT-ACCOUNT.md` - Créer des comptes agents
- `README-IMPLEMENTATION.md` - Documentation technique

## 🚀 Déploiement en production

### Vercel (Gratuit)

```bash
npm install -g vercel
vercel login
vercel
```

### Netlify (Gratuit)

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**N'oubliez pas d'ajouter les variables d'environnement dans le dashboard!**

## ✨ C'est prêt!

Votre Agent Space est maintenant 100% opérationnel et connecté à votre vraie base de données Supabase.

Bon travail! 🎉

---

**Support**: Si vous avez des questions, consultez la documentation ou vérifiez les logs de la console (F12).
