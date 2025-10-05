# Configuration de la base de données Supabase

## ✅ Connexion configurée

Votre application est maintenant connectée à votre vraie base de données Supabase:

- **URL**: https://ysljvvzuiahymadufqjg.supabase.co
- **Statut**: Configuré dans `.env`

## 📋 Créer les tables dans Supabase

### Option 1: Via l'interface Supabase (Recommandé)

1. Allez sur https://supabase.com/dashboard
2. Connectez-vous et sélectionnez votre projet
3. Cliquez sur **SQL Editor** dans le menu de gauche
4. Cliquez sur **New query**
5. Copiez le contenu du fichier `supabase/migrations/create_tables.sql`
6. Collez-le dans l'éditeur SQL
7. Cliquez sur **Run** (bouton vert)

### Option 2: SQL rapide

Copiez et exécutez ce SQL dans l'éditeur SQL de Supabase:

```sql
-- 1. Table des agents
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_complet text NOT NULL,
  email text UNIQUE NOT NULL,
  mot_de_passe text NOT NULL,
  telephone text NOT NULL,
  role text NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent', 'scanner')),
  bureau_localisation text DEFAULT '',
  actif boolean DEFAULT true,
  date_creation timestamptz DEFAULT now(),
  derniere_connexion timestamptz
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- 2. Table des expéditeurs
CREATE TABLE IF NOT EXISTS expediteurs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_complet text NOT NULL,
  telephone text NOT NULL,
  email text NOT NULL,
  adresse_complete text DEFAULT '',
  ville text DEFAULT '',
  etat text DEFAULT '',
  code_postal text DEFAULT '',
  date_creation timestamptz DEFAULT now()
);

ALTER TABLE expediteurs ENABLE ROW LEVEL SECURITY;

-- 3. Table des destinataires
CREATE TABLE IF NOT EXISTS destinataires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_complet text NOT NULL,
  telephone text NOT NULL,
  email text,
  ville_recuperation text NOT NULL,
  adresse_complete text DEFAULT '',
  date_creation timestamptz DEFAULT now()
);

ALTER TABLE destinataires ENABLE ROW LEVEL SECURITY;

-- 4. Table des colis
CREATE TABLE IF NOT EXISTS colis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_suivi text UNIQUE NOT NULL,
  qr_code text UNIQUE NOT NULL,
  expediteur_id uuid NOT NULL REFERENCES expediteurs(id) ON DELETE CASCADE,
  destinataire_id uuid NOT NULL REFERENCES destinataires(id) ON DELETE CASCADE,
  agent_enregistrement_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  type_colis text NOT NULL,
  poids_lbs numeric NOT NULL CHECK (poids_lbs > 0),
  longueur_cm numeric,
  largeur_cm numeric,
  hauteur_cm numeric,
  description_detaillee text NOT NULL,
  quantite_articles integer DEFAULT 1 CHECK (quantite_articles > 0),
  instructions_speciales text,
  statut text DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_transit', 'arrive_bureau', 'pret_recuperation', 'recupere')),
  date_enregistrement timestamptz DEFAULT now(),
  date_prevue_arrivee date,
  cout_expedition numeric CHECK (cout_expedition >= 0)
);

ALTER TABLE colis ENABLE ROW LEVEL SECURITY;

-- 5. Table de l'historique
CREATE TABLE IF NOT EXISTS suivi_historique (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colis_id uuid NOT NULL REFERENCES colis(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  statut_precedent text,
  nouveau_statut text NOT NULL,
  localisation text DEFAULT '',
  commentaire text DEFAULT '',
  date_scan timestamptz DEFAULT now()
);

ALTER TABLE suivi_historique ENABLE ROW LEVEL SECURITY;

-- 6. Table des photos
CREATE TABLE IF NOT EXISTS colis_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colis_id uuid NOT NULL REFERENCES colis(id) ON DELETE CASCADE,
  nom_fichier text NOT NULL,
  chemin_fichier text NOT NULL,
  taille_fichier integer CHECK (taille_fichier > 0),
  date_upload timestamptz DEFAULT now()
);

ALTER TABLE colis_photos ENABLE ROW LEVEL SECURITY;

-- 7. Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colis_id uuid NOT NULL REFERENCES colis(id) ON DELETE CASCADE,
  destinataire_telephone text NOT NULL,
  destinataire_email text,
  type_notification text NOT NULL CHECK (type_notification IN ('enregistrement', 'transit', 'arrive', 'pret_recuperation')),
  titre text NOT NULL,
  message text NOT NULL,
  envoyee boolean DEFAULT false,
  date_creation timestamptz DEFAULT now(),
  date_envoi timestamptz
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Lecture publique colis" ON colis FOR SELECT TO anon USING (true);
CREATE POLICY "Agents tout sur colis" ON colis FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Lecture publique historique" ON suivi_historique FOR SELECT TO anon USING (true);
CREATE POLICY "Agents créent historique" ON suivi_historique FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Lecture publique expediteurs" ON expediteurs FOR SELECT TO anon USING (true);
CREATE POLICY "Agents tout sur expediteurs" ON expediteurs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Lecture publique destinataires" ON destinataires FOR SELECT TO anon USING (true);
CREATE POLICY "Agents tout sur destinataires" ON destinataires FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Agents profil" ON agents FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Agents MAJ profil" ON agents FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Index
CREATE INDEX IF NOT EXISTS idx_colis_numero_suivi ON colis(numero_suivi);
CREATE INDEX IF NOT EXISTS idx_colis_statut ON colis(statut);
```

## 🔑 Créer un compte agent

Après avoir créé les tables, créez votre premier compte agent:

### Dans Supabase Dashboard:

1. **Authentication** > **Users** > **Add user**
   - Email: votre@email.com
   - Password: VotreMotDePasse123!
   - ✅ Auto Confirm User: OUI

2. **Table Editor** > **agents** > **Insert row**
   - id: (copiez l'UUID de l'utilisateur créé dans Auth)
   - nom_complet: "Votre Nom"
   - email: votre@email.com (même que dans Auth)
   - mot_de_passe: "hash_temporaire"
   - telephone: "+1234567890"
   - role: "admin"
   - bureau_localisation: "Miami"
   - actif: true

### Ou via SQL:

```sql
-- Après avoir créé l'utilisateur dans Auth, remplacez 'USER_UUID' et les infos
INSERT INTO agents (id, nom_complet, email, mot_de_passe, telephone, role, actif)
VALUES (
  'USER_UUID_ICI',
  'Votre Nom',
  'votre@email.com',
  'hash_temporaire',
  '+1234567890',
  'admin',
  true
);
```

## ✅ Vérification

1. Allez dans **Table Editor**
2. Vous devriez voir 7 tables:
   - agents
   - expediteurs
   - destinataires
   - colis
   - suivi_historique
   - colis_photos
   - notifications

## 🚀 Test de l'application

1. Build et lancement:
```bash
npm run build
npm run dev
```

2. Accédez à: `http://localhost:5173/agent-space`
3. Connectez-vous avec vos identifiants
4. Vous devriez voir le Dashboard!

## 📊 Activer Realtime (Optionnel)

Pour les mises à jour en temps réel:

1. **Database** > **Replication** dans Supabase
2. Activez la réplication pour la table `colis`
3. Sauvegardez

## 🆘 Problèmes courants

### "relation does not exist"
- Les tables n'ont pas été créées
- Exécutez le SQL de migration

### "Invalid credentials"
- Vérifiez que l'utilisateur existe dans Auth ET dans la table agents
- Vérifiez que `actif = true`

### "Permission denied"
- Les politiques RLS ne sont pas créées
- Exécutez la section des politiques du SQL

## 📝 Statut

- ✅ Variables d'environnement configurées
- ⏳ Tables à créer dans Supabase
- ⏳ Compte agent à créer
- ⏳ Test de connexion

Suivez ce guide étape par étape et votre Agent Space sera opérationnel!
