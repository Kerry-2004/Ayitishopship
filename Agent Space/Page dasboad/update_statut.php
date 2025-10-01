<?php
// Connexion MySQL (XAMPP)
$host = "localhost";
$user = "root"; // par défaut XAMPP
$pass = "";     
$db   = "Ayitishopship";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Erreur connexion : " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $numero_suivi = $_POST['numero_suivi'];
    $nouveau_statut = $_POST['statut'];
    $agent_id = 1; // ⚠️ à adapter selon l’agent connecté
    $localisation = $_POST['localisation'];
    $commentaire = $_POST['commentaire'];

    // Récupérer le colis par son numéro de suivi
    $sqlColis = "SELECT id, statut FROM colis WHERE numero_suivi = ?";
    $stmtColis = $conn->prepare($sqlColis);
    $stmtColis->bind_param("s", $numero_suivi);
    $stmtColis->execute();
    $result = $stmtColis->get_result();

    if ($result->num_rows > 0) {
        $colis = $result->fetch_assoc();
        $colis_id = $colis['id'];
        $statut_precedent = $colis['statut'];

        // Si le colis n'a pas encore de statut, on force le premier statut_precedent à "REÇU"
        if (empty($statut_precedent)) {
            $statut_precedent = "REÇU";
        }

        // Insérer dans l’historique
        $sqlInsert = "INSERT INTO suivi_historique (colis_id, agent_id, statut_precedent, nouveau_statut, localisation, commentaire, date_scan)
                      VALUES (?, ?, ?, ?, ?, ?, NOW())";
        $stmtInsert = $conn->prepare($sqlInsert);
        $stmtInsert->bind_param("iissss", $colis_id, $agent_id, $statut_precedent, $nouveau_statut, $localisation, $commentaire);

        if ($stmtInsert->execute()) {
            // Mettre à jour le statut actuel du colis dans la table "colis"
            $sqlUpdate = "UPDATE colis SET statut = ?, date_modification = NOW() WHERE id = ?";
            $stmtUpdate = $conn->prepare($sqlUpdate);
            $stmtUpdate->bind_param("si", $nouveau_statut, $colis_id);
            $stmtUpdate->execute();

            echo "<p style='color:green;'>✅ Historique ajouté et statut du colis mis à jour.</p>";
        } else {
            echo "<p style='color:red;'>❌ Erreur lors de l’ajout dans l’historique.</p>";
        }
    } else {
        echo "<p style='color:red;'>⚠️ Aucun colis trouvé avec ce numéro de suivi.</p>";
    }
}
?>

<!-- Formulaire HTML -->
<form method="POST">
    <label>Numéro de suivi :</label>
    <input type="text" name="numero_suivi" placeholder="Ex: ABC123456" required>

    <label>Nouveau statut :</label>
    <select name="statut" required>
        <option value="REÇU">REÇU</option>
        <option value="EN TRANSIT">EN TRANSIT</option>
        <option value="DISPONIBLE">DISPONIBLE</option>
        <option value="LIVRÉ">LIVRÉ</option>
    </select>

    <label>Localisation :</label>
    <input type="text" name="localisation" placeholder="Ex: Port-au-Prince" required>

    <label>Commentaire :</label>
    <textarea name="commentaire" placeholder="Infos supplémentaires..."></textarea>

    <button type="submit">✅ Enregistrer l’historique</button>
</form>
