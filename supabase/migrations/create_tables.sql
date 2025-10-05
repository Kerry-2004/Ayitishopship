/*
  # Création complète du schéma AyitiShop&Ship

  ## Tables créées
  1. agents - Agents d'expédition
  2. expediteurs - Expéditeurs (USA)
  3. destinataires - Destinataires (Haïti)
  4. colis - Colis principaux
  5. suivi_historique - Historique de suivi
  6. colis_photos - Photos des colis
  7. notifications - Notifications clients

  ## Sécurité
  - RLS activé sur toutes les tables
  - Politiques pour accès public (suivi) et agents
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

CREATE POLICY "Agents peuvent lire leur profil"
  ON agents FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Agents peuvent mettre à jour leur profil"
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

CREATE POLICY "Lecture publique expediteurs"
  ON expediteurs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Agents peuvent tout faire sur expediteurs"
  ON expediteurs FOR ALL
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

CREATE POLICY "Lecture publique destinataires"
  ON destinataires FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Agents peuvent tout faire sur destinataires"
  ON destinataires FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

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

CREATE POLICY "Lecture publique colis"
  ON colis FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Agents peuvent tout faire sur colis"
  ON colis FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

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

CREATE POLICY "Lecture publique historique"
  ON suivi_historique FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Agents peuvent créer historique"
  ON suivi_historique FOR INSERT
  TO authenticated
  WITH CHECK (true);

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

CREATE POLICY "Agents peuvent gérer photos"
  ON colis_photos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

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

CREATE POLICY "Agents peuvent gérer notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_colis_numero_suivi ON colis(numero_suivi);
CREATE INDEX IF NOT EXISTS idx_colis_qr_code ON colis(qr_code);
CREATE INDEX IF NOT EXISTS idx_colis_statut ON colis(statut);
CREATE INDEX IF NOT EXISTS idx_colis_expediteur ON colis(expediteur_id);
CREATE INDEX IF NOT EXISTS idx_colis_destinataire ON colis(destinataire_id);
CREATE INDEX IF NOT EXISTS idx_suivi_colis ON suivi_historique(colis_id);
CREATE INDEX IF NOT EXISTS idx_photos_colis ON colis_photos(colis_id);
CREATE INDEX IF NOT EXISTS idx_notifications_colis ON notifications(colis_id);
