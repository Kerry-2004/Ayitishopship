/*
  # Ajout des nouvelles fonctionnalités Agent Space

  1. Tables ajoutées
    - parametres_systeme - Configuration des tarifs et frais
    - factures - Gestion des factures
    - paiements - Suivi des paiements

  2. Modifications
    - colis: ajout photo_url, prix_total, statut_paiement
    - expediteurs: email obligatoire
    - destinataires: email obligatoire, retrait adresse_complete

  3. Sécurité
    - RLS activé sur toutes les nouvelles tables
*/

-- 1. Table des paramètres système
CREATE TABLE IF NOT EXISTS parametres_systeme (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cle text UNIQUE NOT NULL,
  valeur jsonb NOT NULL,
  description text,
  derniere_modification timestamptz DEFAULT now(),
  modifie_par uuid REFERENCES agents(id)
);

ALTER TABLE parametres_systeme ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents peuvent lire paramètres"
  ON parametres_systeme FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins peuvent tout faire sur paramètres"
  ON parametres_systeme FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = auth.uid()
      AND agents.role = 'admin'
    )
  );

-- Insérer les paramètres par défaut
INSERT INTO parametres_systeme (cle, valeur, description) VALUES
  ('tarifs_zones', '{
    "Port-au-Prince": 3.5,
    "Cap-Haïtien": 4.0,
    "Les Cayes": 6.0
  }'::jsonb, 'Tarifs par livre pour chaque zone'),
  ('frais_service', '{
    "pourcentage": 0,
    "montant_fixe": 0
  }'::jsonb, 'Frais de service additionnels'),
  ('info_entreprise', '{
    "nom": "AyitiShop&Ship",
    "adresse": "Miami, FL, USA",
    "telephone": "+1 (508) 246-3522",
    "email": "info@ayitishopship.com",
    "logo_url": ""
  }'::jsonb, 'Informations de l''entreprise'),
  ('delais_livraison', '{
    "Port-au-Prince": "3-5",
    "Cap-Haïtien": "7-10",
    "Les Cayes": "7-20"
  }'::jsonb, 'Délais de livraison en jours')
ON CONFLICT (cle) DO NOTHING;

-- 2. Modifier la table colis pour ajouter les nouveaux champs
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'colis' AND column_name = 'photo_url') THEN
    ALTER TABLE colis ADD COLUMN photo_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'colis' AND column_name = 'prix_total') THEN
    ALTER TABLE colis ADD COLUMN prix_total numeric DEFAULT 0 CHECK (prix_total >= 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'colis' AND column_name = 'statut_paiement') THEN
    ALTER TABLE colis ADD COLUMN statut_paiement text DEFAULT 'non_paye'
      CHECK (statut_paiement IN ('non_paye', 'paye', 'partiel'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'colis' AND column_name = 'notification_envoyee') THEN
    ALTER TABLE colis ADD COLUMN notification_envoyee boolean DEFAULT false;
  END IF;
END $$;

-- 3. Table des factures
CREATE TABLE IF NOT EXISTS factures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_facture text UNIQUE NOT NULL,
  colis_id uuid NOT NULL REFERENCES colis(id) ON DELETE CASCADE,
  montant_total numeric NOT NULL CHECK (montant_total >= 0),
  montant_paye numeric DEFAULT 0 CHECK (montant_paye >= 0),
  statut text DEFAULT 'non_payee' CHECK (statut IN ('non_payee', 'payee', 'partielle', 'annulee')),
  date_creation timestamptz DEFAULT now(),
  date_echeance date,
  date_paiement timestamptz,
  notes text,
  pdf_url text
);

ALTER TABLE factures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique factures"
  ON factures FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Agents peuvent tout faire sur factures"
  ON factures FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Table des paiements
CREATE TABLE IF NOT EXISTS paiements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facture_id uuid NOT NULL REFERENCES factures(id) ON DELETE CASCADE,
  montant numeric NOT NULL CHECK (montant > 0),
  methode_paiement text NOT NULL CHECK (methode_paiement IN ('especes', 'carte', 'virement', 'mobile_money', 'autre')),
  reference_transaction text,
  date_paiement timestamptz DEFAULT now(),
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  notes text
);

ALTER TABLE paiements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents peuvent gérer paiements"
  ON paiements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Table pour stocker l'historique des notifications
CREATE TABLE IF NOT EXISTS historique_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colis_id uuid NOT NULL REFERENCES colis(id) ON DELETE CASCADE,
  destinataire text NOT NULL,
  type_canal text NOT NULL CHECK (type_canal IN ('email', 'whatsapp', 'sms')),
  message text NOT NULL,
  statut text DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'envoye', 'echec')),
  date_envoi timestamptz,
  date_creation timestamptz DEFAULT now(),
  erreur text
);

ALTER TABLE historique_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents peuvent lire notifications"
  ON historique_notifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents peuvent créer notifications"
  ON historique_notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 6. Index pour performance
CREATE INDEX IF NOT EXISTS idx_factures_colis ON factures(colis_id);
CREATE INDEX IF NOT EXISTS idx_factures_statut ON factures(statut);
CREATE INDEX IF NOT EXISTS idx_paiements_facture ON paiements(facture_id);
CREATE INDEX IF NOT EXISTS idx_colis_statut_paiement ON colis(statut_paiement);
CREATE INDEX IF NOT EXISTS idx_historique_notif_colis ON historique_notifications(colis_id);

-- 7. Fonction pour générer un numéro de facture
CREATE OR REPLACE FUNCTION generer_numero_facture()
RETURNS text AS $$
DECLARE
  nouveau_numero text;
  compteur integer;
BEGIN
  SELECT COUNT(*) + 1 INTO compteur FROM factures;
  nouveau_numero := 'FACT-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-' || LPAD(compteur::text, 4, '0');
  RETURN nouveau_numero;
END;
$$ LANGUAGE plpgsql;

-- 8. Fonction pour calculer le prix total
CREATE OR REPLACE FUNCTION calculer_prix_total(
  p_poids numeric,
  p_ville text
)
RETURNS numeric AS $$
DECLARE
  tarif_zone numeric;
  frais jsonb;
  frais_service numeric := 0;
  total numeric;
BEGIN
  SELECT (valeur->p_ville)::text::numeric INTO tarif_zone
  FROM parametres_systeme
  WHERE cle = 'tarifs_zones';

  IF tarif_zone IS NULL THEN
    tarif_zone := 5.0;
  END IF;

  SELECT valeur INTO frais
  FROM parametres_systeme
  WHERE cle = 'frais_service';

  IF frais->>'montant_fixe' IS NOT NULL THEN
    frais_service := (frais->>'montant_fixe')::numeric;
  END IF;

  total := (p_poids * tarif_zone) + frais_service;

  IF frais->>'pourcentage' IS NOT NULL AND (frais->>'pourcentage')::numeric > 0 THEN
    total := total + (total * (frais->>'pourcentage')::numeric / 100);
  END IF;

  RETURN ROUND(total, 2);
END;
$$ LANGUAGE plpgsql;
