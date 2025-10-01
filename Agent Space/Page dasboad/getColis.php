<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dsn = "mysql:host=localhost;dbname=AyitishopShip;charset=utf8mb4";
$user = "root";
$pass = "";

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

// 🔹 Requête principale pour les infos colis
$stmt = $pdo->prepare("
    SELECT 
        c.id,
        c.numero_suivi,
        c.type_colis,
        c.poids_lbs,
        c.description_detaillee,
        d.nom_complet AS destinataire_nom,
        d.ville_recuperation,
        a.nom_complet AS agent_nom,
        c.date_prevue_arrivee,
        c.date_enregistrement
    FROM colis c
    JOIN destinataires d ON c.destinataire_id = d.id
    JOIN agents a ON c.agent_enregistrement_id = a.id
    WHERE c.numero_suivi = ?
");
$stmt->execute([$trackingNumber]);
$colis = $stmt->fetch(PDO::FETCH_ASSOC);

if ($colis) {
    // 🔹 Requête pour récupérer tout l’historique
    $histStmt = $pdo->prepare("
        SELECT 
            sh.nouveau_statut,
            sh.localisation,
            sh.commentaire,
            sh.date_scan
        FROM suivi_historique sh
        WHERE sh.colis_id = ?
        ORDER BY sh.date_scan ASC
    ");
    $histStmt->execute([$colis['id']]);
    $historique = $histStmt->fetchAll(PDO::FETCH_ASSOC);

    // Ajouter l’historique au retour JSON
    $colis['historique'] = $historique;

    echo json_encode(['success' => true, 'data' => $colis]);
} else {
    echo json_encode(['success' => false, 'error' => 'Colis non trouvé']);
}
