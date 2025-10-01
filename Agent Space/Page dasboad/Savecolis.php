<?php
header("Content-Type: application/json");
ini_set('display_errors', 0);
error_reporting(E_ALL);

$response = ["success" => false, "error" => ""];

try {
    // 1. Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=AyitishopShip;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 2. Insertion de l'expéditeur
    $stmt = $pdo->prepare("INSERT INTO expediteurs (nom_complet, telephone, email, adresse_complete, ville, etat) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $_POST['expediteur']['nom_complet'],
        $_POST['expediteur']['telephone'],
        $_POST['expediteur']['email'],
        $_POST['expediteur']['adresse_complete'],
        $_POST['expediteur']['ville'],
        $_POST['expediteur']['etat']
    ]);
    $expediteur_id = $pdo->lastInsertId();

    // 3. Insertion du destinataire
    $stmt = $pdo->prepare("INSERT INTO destinataires (nom_complet, telephone, email, ville_recuperation, adresse_complete) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $_POST['destinataire']['nom_complet'],
        $_POST['destinataire']['telephone'],
        $_POST['destinataire']['email'] ?? null,
        $_POST['destinataire']['ville_recuperation'],
        $_POST['destinataire']['adresse_complete']
    ]);
    $destinataire_id = $pdo->lastInsertId();

    // 4. ID de l'agent (peut être défini dynamiquement via login)
    $agent_id = 1; // exemple

    // 5. Insertion du colis
    $stmt = $pdo->prepare("INSERT INTO colis (numero_suivi, qr_code, expediteur_id, destinataire_id, agent_enregistrement_id, type_colis, poids_lbs, description_detaillee, quantite_articles, instructions_speciales, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente')");
    $numero_suivi = "ASH-" . time() . rand(100,999);
    $qr_code = "QR-" . $numero_suivi;
    $stmt->execute([
        $numero_suivi,
        $qr_code,
        $expediteur_id,
        $destinataire_id,
        $agent_id,
        $_POST['colis']['type_colis'],
        $_POST['colis']['poids_lbs'],
        $_POST['colis']['description_detaillee'],
        $_POST['colis']['quantite_articles'] ?? 1,
        $_POST['colis']['instructions_speciales'] ?? ''
    ]);

    // 6. Retour JSON pour JS
    $response["success"] = true;
    $response["data"] = [
        "colis_id" => $pdo->lastInsertId(),
        "numero_suivi" => $numero_suivi,
        "qr_code" => $qr_code
    ];

} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
exit;
