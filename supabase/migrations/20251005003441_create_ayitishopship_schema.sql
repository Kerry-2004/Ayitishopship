/*
  # Création du schéma AyitiShop&Ship - Système de gestion d'expédition de colis
  
  ## Tables créées
  
  ### 1. `agents` - Table des agents d'expédition
    - `id` (uuid, primary key)
    - `nom_complet` (text) - Nom complet de l'agent
    - `email` (text, unique) - Email de connexion
    - `mot_de_passe` (text) - Mot de passe hashé
    - `telephone` (text) - Numéro de téléphone
    - `role` (text) - Rôle (admin, agent, scanner)
    - `bureau_localisation` (text) - Localisation du bureau
    - `actif` (boolean) - Compte actif ou non
    - `date_creation` (timestamptz)
    - `derniere_connexion` (timestamptz)
  
  ### 2. `expediteurs` - Table des expéditeurs (USA)
    - `id` (uuid, primary key)
    - `nom_complet` (text)
    - `telephone` (text)
    - `email` (text)
    - `adresse_complete` (text)
    - `ville` (text)
    - `etat` (text)
    - `code_postal` (text)
    - `date_creation` (timestamptz)
  
  ### 3. `destinataires` - Table des destinataires (Haïti)
    - `id` (uuid, primary key)
    - `nom_complet` (text)
    - `telephone` (text)
    - `email` (text, nullable)
    - `ville_recuperation` (text) - Ville de récupération en Haïti
    - `adresse_complete` (text)
    - `date_creation` (timestamptz)
  
  ### 4. `colis` - Table principale des colis
    - `id` (uuid, primary key)
    - `numero_suivi` (text, unique) - Numéro de suivi unique
    - `qr_code` (text, unique) - Code QR unique
    - `expediteur_id` (uuid) - Référence à expediteurs
    - `destinataire_id` (uuid) - Référence à destinataires
    - `agent_enregistrement_id` (uuid) - Agent qui a enregistré
    - `type_colis` (text) - Type de colis
    - `poids_lbs` (numeric) - Poids en livres
    - `longueur_cm` (numeric, nullable)
    - `largeur_cm` (numeric, nullable)
    - `hauteur_cm` (numeric, nullable)
    - `description_detaillee` (text)
    - `quantite_articles` (integer, default 1)
    - `instructions_speciales` (text, nullable)
    - `statut` (text, default 'en_attente') - Statut actuel
    - `date_enregistrement` (timestamptz, default now())
    - `date_prevue_arrivee` (date, nullable)
    - `cout_expedition` (numeric, nullable)
  
  ### 5. `suivi_historique` - Historique de suivi des colis
    - `id` (uuid, primary key)
    - `colis_id` (uuid) - Référence à colis
    - `agent_id` (uuid, nullable) - Agent qui a scanné
    - `statut_precedent` (text, nullable)
    - `nouveau_statut` (text)
    - `localisation` (text)
    - `commentaire` (text)
    - `date_scan` (timestamptz, default now())
  
  ### 6. `colis_photos` - Photos des colis
    - `id` (uuid, primary key)
    - `colis_id` (uuid) - Référence à colis
    - `nom_fichier` (text)
    - `chemin_fichier` (text)
    - `taille_fichier` (integer)
    - `date_upload` (timestamptz, default now())
  
  ### 7. `notifications` - Notifications aux clients
    - `id` (uuid, primary key)
    - `colis_id` (uuid) - Référence à colis
    - `destinataire_telephone` (text)
    - `destinataire_email` (text, nullable)
    - `type_notification` (text)
    - `titre` (text)
    - `message` (text)
    - `envoyee` (boolean, default false)
    - `date_creation` (timestamptz, default now())
    - `date_envoi` (timestamptz, nullable)
  
  ## Sécurité
  
  - RLS activé sur toutes les tables
  - Politiques pour les agents authentifiés
  - Politiques publiques pour le suivi de colis (lecture seule)
  
  ## Notes importantes
  
  - Tous les IDs utilisent UUID pour plus de sécurité
  - Les numéros de suivi sont générés au format AYITI-YYMMDD-XXXX
  - Le statut du colis peut être: en_attente, en_transit, arrive_bureau, pret_recuperation, recupere
  - Les photos sont stockées avec référence au fichier (stockage séparé requis)
*/

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

CREATE POLICY "Agents authentifiés peuvent lire leur profil"
  ON agents FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Agents authentifiés peuvent mettre à jour leur profil"
  ON agents FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

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

CREATE POLICY "Agents authentifiés peuvent lire les expéditeurs"
  ON expediteurs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents authentifiés peuvent créer des expéditeurs"
  ON expediteurs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Agents authentifiés peuvent mettre à jour les expéditeurs"
  ON expediteurs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

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

CREATE POLICY "Agents authentifiés peuvent lire les destinataires"
  ON destinataires FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents authentifiés peuvent créer des destinataires"
  ON destinataires FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Agents authentifiés peuvent mettre à jour les destinataires"
  ON destinataires FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Table principale des colis
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

CREATE POLICY "Tout le monde peut lire les colis publiquement"
  ON colis FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Agents authentifiés peuvent lire tous les colis"
  ON colis FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents authentifiés peuvent créer des colis"
  ON colis FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Agents authentifiés peuvent mettre à jour les colis"
  ON colis FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Agents authentifiés peuvent supprimer des colis"
  ON colis FOR DELETE
  TO authenticated
  USING (true);

-- 5. Table de l'historique de suivi
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

CREATE POLICY "Tout le monde peut lire l'historique publiquement"
  ON suivi_historique FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Agents authentifiés peuvent lire l'historique"
  ON suivi_historique FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents authentifiés peuvent créer des entrées d'historique"
  ON suivi_historique FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 6. Table des photos de colis
CREATE TABLE IF NOT EXISTS colis_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colis_id uuid NOT NULL REFERENCES colis(id) ON DELETE CASCADE,
  nom_fichier text NOT NULL,
  chemin_fichier text NOT NULL,
  taille_fichier integer CHECK (taille_fichier > 0),
  date_upload timestamptz DEFAULT now()
);

ALTER TABLE colis_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents authentifiés peuvent lire les photos"
  ON colis_photos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents authentifiés peuvent créer des photos"
  ON colis_photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Agents authentifiés peuvent supprimer des photos"
  ON colis_photos FOR DELETE
  TO authenticated
  USING (true);

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

CREATE POLICY "Agents authentifiés peuvent lire les notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents authentifiés peuvent créer des notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Agents authentifiés peuvent mettre à jour les notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_colis_numero_suivi ON colis(numero_suivi);
CREATE INDEX IF NOT EXISTS idx_colis_qr_code ON colis(qr_code);
CREATE INDEX IF NOT EXISTS idx_colis_statut ON colis(statut);
CREATE INDEX IF NOT EXISTS idx_colis_expediteur ON colis(expediteur_id);
CREATE INDEX IF NOT EXISTS idx_colis_destinataire ON colis(destinataire_id);
CREATE INDEX IF NOT EXISTS idx_suivi_colis ON suivi_historique(colis_id);
CREATE INDEX IF NOT EXISTS idx_photos_colis ON colis_photos(colis_id);
CREATE INDEX IF NOT EXISTS idx_notifications_colis ON notifications(colis_id);
CREATE INDEX IF NOT EXISTS idx_notifications_envoyee ON notifications(envoyee);
