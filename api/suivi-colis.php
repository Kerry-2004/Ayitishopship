<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../classes/ColisManager.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

try {
    $numeroSuivi = $_GET['numero_suivi'] ?? '';
    
    if (empty($numeroSuivi)) {
        throw new Exception('Numéro de suivi requis');
    }
    
    $colisManager = new ColisManager();
    $colis = $colisManager->obtenirColis($numeroSuivi);
    
    if (!$colis) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Colis non trouvé'
        ]);
        exit;
    }
    
    // Formater les données pour l'affichage
    $response = [
        'success' => true,
        'data' => [
            'numero_suivi' => $colis['numero_suivi'],
            'statut' => $colis['statut'],
            'expediteur' => [
                'nom' => $colis['expediteur_nom'],
                'telephone' => $colis['expediteur_telephone'],
                'email' => $colis['expediteur_email']
            ],
            'destinataire' => [
                'nom' => $colis['destinataire_nom'],
                'telephone' => $colis['destinataire_telephone'],
                'email' => $colis['destinataire_email'],
                'ville' => $colis['ville_recuperation']
            ],
            'colis' => [
                'type' => $colis['type_colis'],
                'poids' => $colis['poids_lbs'],
                'cout' => $colis['cout_expedition'],
                'date_enregistrement' => $colis['date_enregistrement'],
                'date_prevue_arrivee' => $colis['date_prevue_arrivee']
            ],
            'historique' => array_map(function($h) {
                return [
                    'statut' => $h['nouveau_statut'],
                    'date' => $h['date_scan'],
                    'localisation' => $h['localisation'],
                    'commentaire' => $h['commentaire'],
                    'agent' => $h['agent_nom']
                ];
            }, $colis['historique']),
            'photos' => $colis['photos']
        ]
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>