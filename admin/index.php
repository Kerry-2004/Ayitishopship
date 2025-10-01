<?php
session_start();

// ----------------------
// Paramètres base MySQL
// ----------------------
$host = "localhost"; 
$user = "root";       // ton utilisateur MySQL
$pass = "";           // ton mot de passe MySQL
$dbname = "Ayitishopship";

// Connexion MySQL
$conn = new mysqli($host, $user, $pass, $dbname);
if($conn->connect_error){
    die("Échec de connexion à la base : " . $conn->connect_error);
}

// Message d'erreur par défaut
$error = "";

// ----------------------
// Vérification login
// ----------------------
if($_SERVER["REQUEST_METHOD"] === "POST"){
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Préparer la requête
    $stmt = $conn->prepare("SELECT id, nom_complet, email, role, actif, mot_de_passe FROM Agents WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows === 1){
        $agent = $result->fetch_assoc();

        // Vérifier mot de passe
        if(password_verify($password, $agent['mot_de_passe'])){
            if($agent['actif'] == 1){
                // Mettre à jour dernière connexion
                $update = $conn->prepare("UPDATE Agents SET derniere_connexion = NOW() WHERE id = ?");
                $update->bind_param("i", $agent['id']);
                $update->execute();

                // Créer la session
                $_SESSION['agent_id'] = $agent['id'];
                $_SESSION['nom_complet'] = $agent['nom_complet'];
                $_SESSION['role'] = $agent['role'];

                // Rediriger
                header("Location: dashboard.php");
                exit;
            } else {
                $error = "Votre compte est désactivé.";
            }
        } else {
            $error = "Mot de passe incorrect.";
        }
    } else {
        $error = "Email introuvable.";
    }
}
?>
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Connexion Agents - AyitiShop&Ship</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{ --blue:#001b72; --red:#ea002a; --bg:#f6f7fb; }
*{box-sizing:border-box;font-family:'Poppins', sans-serif;}
body{margin:0;background:var(--bg);display:flex;align-items:center;justify-content:center;height:100vh}
.card{width:380px;background:#fff;border-radius:16px;box-shadow:0 8px 30px rgba(2,6,23,0.08);padding:32px}
.logo img{height:100px;width:auto;display:block;margin:auto;}
h1{margin:0;font-size:20px;color:var(--blue);font-weight:600;text-align:center}
p.subtitle{margin:6px 0 20px;color:#666;font-size:14px;text-align:center}
label{display:block;font-size:14px;margin-bottom:6px;color:#222;font-weight:500}
input[type="email"],input[type="password"]{width:100%;padding:12px;border-radius:10px;border:1px solid #e6e9ef;margin-bottom:14px;font-size:14px}
.actions{display:flex;align-items:center;justify-content:space-between;margin-top:8px}
.btn{background:var(--blue);color:#fff;padding:12px 18px;border-radius:10px;border:none;cursor:pointer;font-weight:600;transition:all 0.2s}
.btn:hover{background:#ea002a}
.btn.secondary{background:transparent;border:1px solid #e6e9ef;color:var(--blue);font-weight:500;text-decoration:none}
.btn.secondary:hover{border-color:var(--blue);}
.error{color:var(--red);font-size:13px;margin-top:10px;text-align:center}
@media(max-width:420px){.card{width:92%;padding:24px}}
</style>
</head>
<body>
<div class="card">
<div class="logo">
<img src="LOGO.png" alt="AyitiShop&Ship Logo">
</div>
<h1>Connexion Agents</h1>
<p class="subtitle">Entrez vos identifiants pour accéder au tableau de bord des agents shipping</p>

<form method="POST" action="" autocomplete="off">
<label for="email">Email</label>
<input id="email" name="email" type="email" required placeholder="votre.email@exemple.com">

<label for="password">Mot de passe</label>
<input id="password" name="password" type="password" required placeholder="••••••••">

<div class="actions">
<button type="submit" class="btn">Se connecter</button>
<a href="#" class="btn secondary">Aide</a>
</div>

<?php if(!empty($error)): ?>
    <p class="error"><?= $error; ?></p>
<?php endif; ?>
</form>
</div>
</body>
</html>
