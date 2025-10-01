<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permet les tests cross-origin si nécessaire

$dsn = "mysql:host=localhost;dbname=AyitishopShip;charset=utf8mb4";
$user = "root"; // votre utilisateur MySQL
$pass = "";     // votre mot de passe MySQL

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}

$trackingNumber = $_GET['trackingNumber'] ?? '';

if (!$trackingNumber) {
    echo json_encode(['success' => false, 'error' => 'Numéro de suivi manquant']);
    exit;
}

$stmt = $pdo->prepare("
    SELECT c.numero_suivi, c.type_colis, c.poids_lbs, c.description_detaillee,
           d.nom_complet AS destinataire_nom, d.ville_recuperation,
           a.nom_complet AS agent_nom, c.statut, c.date_prevue_arrivee
    FROM colis c
    JOIN destinataires d ON c.destinataire_id = d.id
    JOIN agents a ON c.agent_enregistrement_id = a.id
    WHERE c.numero_suivi = ?
");
$stmt->execute([$trackingNumber]);
$colis = $stmt->fetch(PDO::FETCH_ASSOC);

if ($colis) {
    echo json_encode(['success' => true, 'data' => $colis]);
} else {
    echo json_encode(['success' => false, 'error' => 'Colis non trouvé']);
}
