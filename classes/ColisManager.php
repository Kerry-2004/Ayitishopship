<?php
require_once 'config/database.php';

/**
 * Gestionnaire des colis - Classe principale pour la gestion des colis
 */
class ColisManager {
    private $db;
    private $helper;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->helper = new DatabaseHelper();
    }
    
    /**
     * Enregistre un nouveau colis
     */
    public function enregistrerColis($data) {
        try {
            $this->db->beginTransaction();
            
            // 1. Enregistrer ou récupérer l'expéditeur
            $expediteurId = $this->gererExpediteur($data['expediteur']);
            
            // 2. Enregistrer ou récupérer le destinataire
            $destinataireId = $this->gererDestinataire($data['destinataire']);
            
            // 3. Générer les identifiants uniques
            $numeroSuivi = $this->helper->generateTrackingNumber();
            $qrCode = $this->helper->generateQRCode($numeroSuivi);
            
            // 4. Calculer le coût et la date d'arrivée
            $coutExpedition = $this->helper->calculateShippingCost(
                $data['colis']['poids_lbs'], 
                $data['destinataire']['ville_recuperation']
            );
            $datePrevueArrivee = $this->helper->estimateArrivalDate(
                $data['destinataire']['ville_recuperation']
            );
            
            // 5. Enregistrer le colis
            $colisId = $this->enregistrerColisDetails(
                $numeroSuivi, $qrCode, $expediteurId, $destinataireId, 
                $data['colis'], $coutExpedition, $datePrevueArrivee, $data['agent_id']
            );
            
            // 6. Ajouter l'historique initial
            $this->ajouterHistorique($colisId, $data['agent_id'], null, 'en_attente', 'USA - Enregistrement initial');
            
            // 7. Traiter les photos si présentes
            if (!empty($data['photos'])) {
                $this->traiterPhotos($colisId, $data['photos']);
            }
            
            // 8. Créer la notification d'enregistrement
            $this->creerNotification($colisId, 'enregistrement');
            
            $this->db->commit();
            
            return [
                'success' => true,
                'colis_id' => $colisId,
                'numero_suivi' => $numeroSuivi,
                'qr_code' => $qrCode,
                'cout_expedition' => $coutExpedition,
                'date_prevue_arrivee' => $datePrevueArrivee
            ];
            
        } catch (Exception $e) {
            $this->db->rollback();
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Gère l'expéditeur (création ou récupération)
     */
    private function gererExpediteur($expediteur) {
        // Vérifier si l'expéditeur existe déjà
        $stmt = $this->db->query(
            "SELECT id FROM expediteurs WHERE email = ? OR telephone = ?",
            [$expediteur['email'], $expediteur['telephone']]
        );
        
        $existant = $stmt->fetch();
        if ($existant) {
            return $existant['id'];
        }
        
        // Créer un nouvel expéditeur
        $stmt = $this->db->query(
            "INSERT INTO expediteurs (nom_complet, telephone, email, adresse_complete, ville, etat, code_postal) 
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $expediteur['nom_complet'],
                $expediteur['telephone'],
                $expediteur['email'],
                $expediteur['adresse_complete'] ?? '',
                $expediteur['ville'] ?? '',
                $expediteur['etat'] ?? '',
                $expediteur['code_postal'] ?? ''
            ]
        );
        
        return $this->db->lastInsertId();
    }
    
    /**
     * Gère le destinataire (création ou récupération)
     */
    private function gererDestinataire($destinataire) {
        // Vérifier si le destinataire existe déjà
        $stmt = $this->db->query(
            "SELECT id FROM destinataires WHERE telephone = ? AND ville_recuperation = ?",
            [$destinataire['telephone'], $destinataire['ville_recuperation']]
        );
        
        $existant = $stmt->fetch();
        if ($existant) {
            return $existant['id'];
        }
        
        // Créer un nouveau destinataire
        $stmt = $this->db->query(
            "INSERT INTO destinataires (nom_complet, telephone, email, ville_recuperation, adresse_complete) 
             VALUES (?, ?, ?, ?, ?)",
            [
                $destinataire['nom_complet'],
                $destinataire['telephone'],
                $destinataire['email'] ?? null,
                $destinataire['ville_recuperation'],
                $destinataire['adresse_complete'] ?? ''
            ]
        );
        
        return $this->db->lastInsertId();
    }
    
    /**
     * Enregistre les détails du colis
     */
    private function enregistrerColisDetails($numeroSuivi, $qrCode, $expediteurId, $destinataireId, $colis, $cout, $dateArrivee, $agentId) {
        $stmt = $this->db->query(
            "INSERT INTO colis (
                numero_suivi, qr_code, expediteur_id, destinataire_id, agent_enregistrement_id,
                type_colis, poids_lbs, longueur_cm, largeur_cm, hauteur_cm,
                description_detaillee, quantite_articles, instructions_speciales,
                date_prevue_arrivee, cout_expedition
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $numeroSuivi, $qrCode, $expediteurId, $destinataireId, $agentId,
                $colis['type_colis'], $colis['poids_lbs'], 
                $colis['longueur_cm'] ?? null, $colis['largeur_cm'] ?? null, $colis['hauteur_cm'] ?? null,
                $colis['description_detaillee'], $colis['quantite_articles'] ?? 1, 
                $colis['instructions_speciales'] ?? null,
                $dateArrivee, $cout
            ]
        );
        
        return $this->db->lastInsertId();
    }
    
    /**
     * Ajoute une entrée dans l'historique de suivi
     */
    public function ajouterHistorique($colisId, $agentId, $statutPrecedent, $nouveauStatut, $commentaire = '', $localisation = '') {
        $stmt = $this->db->query(
            "INSERT INTO suivi_historique (colis_id, agent_id, statut_precedent, nouveau_statut, localisation, commentaire) 
             VALUES (?, ?, ?, ?, ?, ?)",
            [$colisId, $agentId, $statutPrecedent, $nouveauStatut, $localisation, $commentaire]
        );
        
        // Mettre à jour le statut du colis
        $this->db->query(
            "UPDATE colis SET statut = ? WHERE id = ?",
            [$nouveauStatut, $colisId]
        );
    }
    
    /**
     * Traite les photos uploadées
     */
    private function traiterPhotos($colisId, $photos) {
        foreach ($photos as $photo) {
            if ($photo['error'] === UPLOAD_ERR_OK) {
                $nomFichier = uniqid() . '_' . $photo['name'];
                $cheminFichier = "uploads/colis/{$colisId}/" . $nomFichier;
                
                // Créer le dossier si nécessaire
                $dossier = dirname($cheminFichier);
                if (!is_dir($dossier)) {
                    mkdir($dossier, 0755, true);
                }
                
                // Déplacer le fichier
                if (move_uploaded_file($photo['tmp_name'], $cheminFichier)) {
                    $this->db->query(
                        "INSERT INTO colis_photos (colis_id, nom_fichier, chemin_fichier, taille_fichier) 
                         VALUES (?, ?, ?, ?)",
                        [$colisId, $nomFichier, $cheminFichier, $photo['size']]
                    );
                }
            }
        }
    }
    
    /**
     * Crée une notification
     */
    private function creerNotification($colisId, $type) {
        // Récupérer les informations du colis et du destinataire
        $stmt = $this->db->query(
            "SELECT c.numero_suivi, d.nom_complet, d.telephone, d.email, d.ville_recuperation
             FROM colis c 
             JOIN destinataires d ON c.destinataire_id = d.id 
             WHERE c.id = ?",
            [$colisId]
        );
        
        $info = $stmt->fetch();
        if (!$info) return;
        
        $messages = [
            'enregistrement' => [
                'titre' => 'Colis enregistré - AyitiShop&Ship',
                'message' => "Bonjour {$info['nom_complet']}, votre colis {$info['numero_suivi']} a été enregistré et sera expédié vers {$info['ville_recuperation']}. Vous recevrez une notification dès son arrivée."
            ],
            'transit' => [
                'titre' => 'Colis en transit - AyitiShop&Ship',
                'message' => "Votre colis {$info['numero_suivi']} est maintenant en transit vers Haïti."
            ],
            'arrive' => [
                'titre' => 'Colis arrivé - AyitiShop&Ship',
                'message' => "Votre colis {$info['numero_suivi']} est arrivé à notre bureau de {$info['ville_recuperation']}."
            ],
            'pret_recuperation' => [
                'titre' => 'Colis prêt - AyitiShop&Ship',
                'message' => "Votre colis {$info['numero_suivi']} est prêt à être récupéré à notre bureau de {$info['ville_recuperation']}. Apportez une pièce d'identité."
            ]
        ];
        
        $msg = $messages[$type] ?? $messages['enregistrement'];
        
        $this->db->query(
            "INSERT INTO notifications (colis_id, destinataire_telephone, destinataire_email, type_notification, titre, message) 
             VALUES (?, ?, ?, ?, ?, ?)",
            [$colisId, $info['telephone'], $info['email'], $type, $msg['titre'], $msg['message']]
        );
    }
    
    /**
     * Récupère les informations complètes d'un colis
     */
    public function obtenirColis($numeroSuivi) {
        $stmt = $this->db->query(
            "SELECT * FROM vue_colis_complets WHERE numero_suivi = ?",
            [$numeroSuivi]
        );
        
        $colis = $stmt->fetch();
        if (!$colis) {
            return null;
        }
        
        // Récupérer l'historique
        $stmt = $this->db->query(
            "SELECT sh.*, a.nom_complet as agent_nom 
             FROM suivi_historique sh 
             LEFT JOIN agents a ON sh.agent_id = a.id 
             WHERE sh.colis_id = ? 
             ORDER BY sh.date_scan ASC",
            [$colis['id']]
        );
        
        $colis['historique'] = $stmt->fetchAll();
        
        // Récupérer les photos
        $stmt = $this->db->query(
            "SELECT * FROM colis_photos WHERE colis_id = ?",
            [$colis['id']]
        );
        
        $colis['photos'] = $stmt->fetchAll();
        
        return $colis;
    }
    
    /**
     * Met à jour le statut d'un colis (pour les agents)
     */
    public function mettreAJourStatut($numeroSuivi, $nouveauStatut, $agentId, $commentaire = '', $localisation = '') {
        try {
            $this->db->beginTransaction();
            
            // Récupérer le colis
            $stmt = $this->db->query(
                "SELECT id, statut FROM colis WHERE numero_suivi = ?",
                [$numeroSuivi]
            );
            
            $colis = $stmt->fetch();
            if (!$colis) {
                throw new Exception("Colis non trouvé");
            }
            
            // Ajouter l'historique
            $this->ajouterHistorique($colis['id'], $agentId, $colis['statut'], $nouveauStatut, $commentaire, $localisation);
            
            // Créer une notification si nécessaire
            if (in_array($nouveauStatut, ['transit', 'arrive_bureau', 'pret_recuperation'])) {
                $typeNotification = [
                    'en_transit' => 'transit',
                    'arrive_bureau' => 'arrive',
                    'pret_recuperation' => 'pret_recuperation'
                ][$nouveauStatut];
                
                $this->creerNotification($colis['id'], $typeNotification);
            }
            
            $this->db->commit();
            
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->db->rollback();
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
?>