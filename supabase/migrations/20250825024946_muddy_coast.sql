-- =====================================================
-- SCHEMA DE BASE DE DONNÉES POUR AYITISHOP&SHIP
-- =====================================================

-- Table des agents
CREATE TABLE IF NOT EXISTS agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_complet VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    role ENUM('admin', 'agent_usa', 'agent_haiti') DEFAULT 'agent_usa',
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion TIMESTAMP NULL
);

-- Table des expéditeurs (USA)
CREATE TABLE IF NOT EXISTS expediteurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_complet VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    adresse_complete TEXT,
    ville VARCHAR(50),
    etat VARCHAR(50),
    code_postal VARCHAR(10),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_telephone (telephone)
);

-- Table des destinataires (Haïti)
CREATE TABLE IF NOT EXISTS destinataires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_complet VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NULL,
    ville_recuperation ENUM('Les Cayes', 'Port-au-Prince', 'Cap-Haïtien') NOT NULL,
    adresse_complete TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_telephone (telephone),
    INDEX idx_ville (ville_recuperation)
);

-- Table principale des colis
CREATE TABLE IF NOT EXISTS colis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_suivi VARCHAR(50) UNIQUE NOT NULL,
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    
    -- Relations
    expediteur_id INT NOT NULL,
    destinataire_id INT NOT NULL,
    agent_enregistrement_id INT NOT NULL,
    
    -- Informations du colis
    type_colis ENUM('documents', 'vetements', 'electronique', 'alimentaire', 'medicaments', 'autres') NOT NULL,
    poids_lbs DECIMAL(8,2) NOT NULL,
    longueur_cm DECIMAL(8,2),
    largeur_cm DECIMAL(8,2),
    hauteur_cm DECIMAL(8,2),
    description_detaillee TEXT NOT NULL,
    quantite_articles INT DEFAULT 1,
    instructions_speciales TEXT,
    
    -- Informations de transport
    date_prevue_arrivee DATE,
    cout_expedition DECIMAL(10,2),
    
    -- Statut et suivi
    statut ENUM('en_attente', 'en_transit', 'arrive_bureau', 'pret_recuperation', 'recupere', 'probleme') DEFAULT 'en_attente',
    
    -- Métadonnées
    date_enregistrement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Contraintes
    FOREIGN KEY (expediteur_id) REFERENCES expediteurs(id) ON DELETE RESTRICT,
    FOREIGN KEY (destinataire_id) REFERENCES destinataires(id) ON DELETE RESTRICT,
    FOREIGN KEY (agent_enregistrement_id) REFERENCES agents(id) ON DELETE RESTRICT,
    
    -- Index pour performance
    INDEX idx_numero_suivi (numero_suivi),
    INDEX idx_statut (statut),
    INDEX idx_date_enregistrement (date_enregistrement),
    INDEX idx_ville_destination (destinataire_id, statut)
);

-- Table de l'historique de suivi
CREATE TABLE IF NOT EXISTS suivi_historique (
    id INT AUTO_INCREMENT PRIMARY KEY,
    colis_id INT NOT NULL,
    agent_id INT,
    
    -- Informations du scan
    statut_precedent ENUM('en_attente', 'en_transit', 'arrive_bureau', 'pret_recuperation', 'recupere', 'probleme'),
    nouveau_statut ENUM('en_attente', 'en_transit', 'arrive_bureau', 'pret_recuperation', 'recupere', 'probleme') NOT NULL,
    
    -- Localisation et détails
    localisation VARCHAR(100),
    commentaire TEXT,
    
    -- Métadonnées
    date_scan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes
    FOREIGN KEY (colis_id) REFERENCES colis(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL,
    
    -- Index
    INDEX idx_colis_date (colis_id, date_scan),
    INDEX idx_statut (nouveau_statut)
);

-- Table des photos des colis
CREATE TABLE IF NOT EXISTS colis_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    colis_id INT NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    chemin_fichier VARCHAR(500) NOT NULL,
    type_photo ENUM('enregistrement', 'probleme', 'livraison') DEFAULT 'enregistrement',
    taille_fichier INT,
    date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (colis_id) REFERENCES colis(id) ON DELETE CASCADE,
    INDEX idx_colis_type (colis_id, type_photo)
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    colis_id INT NOT NULL,
    destinataire_telephone VARCHAR(20),
    destinataire_email VARCHAR(100),
    
    -- Contenu de la notification
    type_notification ENUM('enregistrement', 'transit', 'arrive', 'pret_recuperation', 'recupere') NOT NULL,
    titre VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Statut d'envoi
    envoye_sms BOOLEAN DEFAULT FALSE,
    envoye_email BOOLEAN DEFAULT FALSE,
    date_envoi TIMESTAMP NULL,
    
    -- Métadonnées
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (colis_id) REFERENCES colis(id) ON DELETE CASCADE,
    INDEX idx_colis_type (colis_id, type_notification),
    INDEX idx_statut_envoi (envoye_sms, envoye_email)
);

-- =====================================================
-- DONNÉES DE TEST
-- =====================================================

-- Insertion d'agents de test
INSERT INTO agents (nom_complet, email, telephone, role) VALUES
('Kerry Cherestal', 'kerrycherestal@gmail.com', '+509-4157-0822', 'admin'),
('Marie Dupont', 'marie.dupont@ayitishopship.com', '+1-508-246-3523', 'agent_usa'),
('Pierre Joseph', 'pierre.joseph@ayitishopship.com', '+509-1234-5678', 'agent_haiti');

-- =====================================================
-- VUES UTILES POUR LES RAPPORTS
-- =====================================================

-- Vue pour les colis avec informations complètes
CREATE VIEW vue_colis_complets AS
SELECT 
    c.id,
    c.numero_suivi,
    c.statut,
    c.type_colis,
    c.poids_lbs,
    c.cout_expedition,
    c.date_enregistrement,
    c.date_prevue_arrivee,
    
    -- Expéditeur
    e.nom_complet AS expediteur_nom,
    e.telephone AS expediteur_telephone,
    e.email AS expediteur_email,
    
    -- Destinataire
    d.nom_complet AS destinataire_nom,
    d.telephone AS destinataire_telephone,
    d.email AS destinataire_email,
    d.ville_recuperation,
    
    -- Agent
    a.nom_complet AS agent_nom
    
FROM colis c
JOIN expediteurs e ON c.expediteur_id = e.id
JOIN destinataires d ON c.destinataire_id = d.id
JOIN agents a ON c.agent_enregistrement_id = a.id;

-- Vue pour les statistiques par ville
CREATE VIEW vue_stats_par_ville AS
SELECT 
    d.ville_recuperation,
    COUNT(*) as total_colis,
    COUNT(CASE WHEN c.statut = 'recupere' THEN 1 END) as colis_recuperes,
    COUNT(CASE WHEN c.statut = 'pret_recuperation' THEN 1 END) as colis_prets,
    AVG(c.poids_lbs) as poids_moyen,
    SUM(c.cout_expedition) as revenus_total
FROM colis c
JOIN destinataires d ON c.destinataire_id = d.id
GROUP BY d.ville_recuperation;