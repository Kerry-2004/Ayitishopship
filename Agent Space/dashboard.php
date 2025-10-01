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

// Si l'agent n'est pas connecté, redirige vers la page de connexion
if(!isset($_SESSION['agent_id'])){
    header("Location: login.php");
    exit;
}

//  // Préparer la requête
$agent_id = $_SESSION['agent_id'];
$stmt = $conn->prepare("SELECT nom_complet, role FROM Agents WHERE id = ?");
$stmt->bind_param("i", $agent_id);
$stmt->execute();
$result = $stmt->get_result();
$agent = $result->fetch_assoc();


// Récupérer les infos de session
$nom_complet = $_SESSION['nom_complet'];
$role = $_SESSION['role'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Sidebar Menu</title>
  <!-- CSS -->
  <link rel="stylesheet" href="style.css">
  <!-- Boxicons CSS -->
  <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
  <!-- Sidebar navigation menu -->
  <nav class="sidebar close">
    <!-- Sidebar header containing logo and toggle button -->
    <header>
      <div class="image-text">
        <span class="image">
          <img src="logo.png" alt="Logo">
        </span>
        <div class="text logo-text">
          <span class="name">AYITISHOP&SHIP</span>
          <span class="profession">Ship USA to Haiti</span>
        </div>
      </div>
      <i class='bx bx-chevron-right toggle'></i>
    </header>

    <!-- Sidebar menu items -->
    <div class="menu-bar">
      <div class="menu">
        <li>
          <i class='bx  bx-user icon'  ></i> 
          <span class="text nav-text"><strong><?= htmlspecialchars($_SESSION['nom_complet']) ?></strong></p>
          <p>Rôle : <strong><?= htmlspecialchars($_SESSION['role']) ?></strong></p></span>
        </li>
        <!-- Search box within the sidebar -->
        <li class="search-box">
          <i class='bx bx-search icon'></i>
          <input type="text" placeholder="Search...">
        </li>
        <!-- List of menu links -->
        <ul class="menu-links">
          <li class="nav-link">
            <a href="#">
              <i class='bx bx-home-alt icon'></i>
              <span class="text nav-text">Dashboard</span>
            </a>
          </li>
          <li class="nav-link">
            <a href=".\Page dasboad\Gestion_Colis.php">
              <i class='bx  bx-package icon'  ></i> 
              <span class="text nav-text">Gestion des Colis</span>
            </a>
          </li>
           <li class="nav-link">
            <a href=".\Page dasboad\testsuivi.html">
              <i class='bx  bx-qr-scan icon'  ></i>
              <span class="text nav-text">Suivi des Colis</span>
            </a>
          </li>
           <li class="nav-link">
            <a href="#">
              <i class='bx  bx-group icon'  ></i>   
              <span class="text nav-text">Client</span>
            </a>
          </li>
          <li class="nav-link">
            <a href="#">
              <i class='bx bx-bell icon'></i>
              <span class="text nav-text">Notifications</span>
            </a>
          </li>
         
          <li class="nav-link">
            <a href="#">
              <i class='bx bx-wallet icon'></i>
              <span class="text nav-text">Wallets</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Bottom content of the sidebar -->
      <div class="bottom-content">
        <li>
          <a href="Login.php">
            <i class='bx bx-log-out icon'></i>
            <span class="text nav-text">Logout</span>
          </a>
        </li>
        <!-- Dark mode toggle switch -->
        <li class="mode">
          <div class="sun-moon">
            <i class='bx bx-moon icon moon'></i>
            <i class='bx bx-sun icon sun'></i>
          </div>
          <span class="mode-text text">Dark mode</span>
          <div class="toggle-switch">
            <span class="switch"></span>
          </div>
        </li>
      </div>
    </div>
  </nav>

  <!-- Main content section -->
  <section class="home">
    <div class="text">Dashboard Sidebar</div>
  </section>

  <!-- JavaScript file -->
  <script src="script.js"></script>
</body>
</html>