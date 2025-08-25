<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../classes/ColisManager.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

try {
    // Récupérer les données JSON
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Données invalides');
    }
    
    // Validation des données requises
    $required = [
        'expediteur' => ['nom_complet', 'telephone', 'email'],
        'destinataire' => ['nom_complet', 'telephone', 'ville_recuperation'],
        'colis' => ['type_colis', 'poids_lbs', 'description_detaillee']
    ];
    
    foreach ($required as $section => $fields) {
        if (!isset($input[$section])) {
            throw new Exception("Section '$section' manquante");
        }
        
        foreach ($fields as $field) {
            if (empty($input[$section][$field])) {
                throw new Exception("Champ '$field' requis dans la section '$section'");
            }
        }
    }
    
    // Validation de la ville de récupération
    $villesValides = ['Les Cayes', 'Port-au-Prince', 'Cap-Haïtien'];
    if (!in_array($input['destinataire']['ville_recuperation'], $villesValides)) {
        throw new Exception('Ville de récupération invalide');
    }
    
    // Validation du type de colis
    $typesValides = ['documents', 'vetements', 'electronique', 'alimentaire', 'medicaments', 'autres'];
    if (!in_array($input['colis']['type_colis'], $typesValides)) {
        throw new Exception('Type de colis invalide');
    }
    
    // Validation du poids
    if (!is_numeric($input['colis']['poids_lbs']) || $input['colis']['poids_lbs'] <= 0) {
        throw new Exception('Poids invalide');
    }
    
    // Agent par défaut (à modifier selon votre système d'authentification)
    $input['agent_id'] = 1; // ID de l'agent connecté
    
    // Traitement des photos si présentes
    if (!empty($_FILES['photos'])) {
        $input['photos'] = $_FILES['photos'];
    }
    
    // Enregistrer le colis
    $colisManager = new ColisManager();
    $resultat = $colisManager->enregistrerColis($input);
    
    if ($resultat['success']) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Colis enregistré avec succès',
            'data' => [
                'colis_id' => $resultat['colis_id'],
                'numero_suivi' => $resultat['numero_suivi'],
                'qr_code' => $resultat['qr_code'],
                'cout_expedition' => $resultat['cout_expedition'],
                'date_prevue_arrivee' => $resultat['date_prevue_arrivee']
            ]
        ]);
    } else {
        throw new Exception($resultat['error']);
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>