<?php
session_start();

// Paramètres de connexion à la base
$host = "localhost"; 
$user = "root";       // ton utilisateur MySQL
$pass = "";           // ton mot de passe MySQL
$dbname = "Ayitishopship";

// Connexion à MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

// Vérifier la connexion
if($conn->connect_error){
    die("Échec de connexion à la base de données : " . $conn->connect_error);
}

// Récupérer les données du formulaire
$email = trim($_POST['email']);
$password = trim($_POST['password']);

// Préparer la requête (sécurité contre injections SQL)
$stmt = $conn->prepare("SELECT id, nom_complet, email, role, actif, mot_de_passe FROM Agents WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Vérifier si l'utilisateur existe
if($result->num_rows === 1){
    $agent = $result->fetch_assoc();

    // Vérification du mot de passe (hash recommandé)
    if(password_verify($password, $agent['mot_de_passe'])){
        
        // Vérifier si le compte est actif
        if($agent['actif'] == 1){
            // Mettre à jour la dernière connexion
            $update = $conn->prepare("UPDATE Agents SET derniere_connexion = NOW() WHERE id = ?");
            $update->bind_param("i", $agent['id']);
            $update->execute();

            // Stocker les infos en session
            $_SESSION['agent_id'] = $agent['id'];
            $_SESSION['nom_complet'] = $agent['nom_complet'];
            $_SESSION['role'] = $agent['role'];

            // Redirection
            header("Location: dashboard.php");
            exit;
        } else {
            header("Location: connexion.html?error=Votre compte est désactivé.");
            exit;
        }
    } else {
        header("Location: connexion.html?error=Mot de passe incorrect.");
        exit;
    }
} else {
    header("Location: connexion.html?error=Email introuvable.");
    exit;
}

$conn->close();
?>
