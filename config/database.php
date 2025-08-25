<?php
/**
 * Configuration de la base de données pour AyitiShop&Ship
 */

class Database {
    private static $instance = null;
    private $connection;
    
    // Configuration de la base de données
    private $host = 'localhost';
    private $database = 'ayitishopship';
    private $username = 'root';
    private $password = '';
    private $charset = 'utf8mb4';
    
    private function __construct() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->database};charset={$this->charset}";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->connection = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            throw new Exception("Erreur de connexion à la base de données: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    // Méthode utilitaire pour exécuter des requêtes
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            throw new Exception("Erreur lors de l'exécution de la requête: " . $e->getMessage());
        }
    }
    
    // Méthode pour obtenir le dernier ID inséré
    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }
    
    // Méthode pour commencer une transaction
    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }
    
    // Méthode pour valider une transaction
    public function commit() {
        return $this->connection->commit();
    }
    
    // Méthode pour annuler une transaction
    public function rollback() {
        return $this->connection->rollback();
    }
}

/**
 * Classe utilitaire pour les opérations de base de données
 */
class DatabaseHelper {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    /**
     * Génère un numéro de suivi unique
     */
    public function generateTrackingNumber() {
        do {
            $timestamp = date('ymd');
            $random = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
            $trackingNumber = "AYITI-{$timestamp}-{$random}";
            
            // Vérifier l'unicité
            $stmt = $this->db->query(
                "SELECT COUNT(*) FROM colis WHERE numero_suivi = ?", 
                [$trackingNumber]
            );
            $exists = $stmt->fetchColumn() > 0;
        } while ($exists);
        
        return $trackingNumber;
    }
    
    /**
     * Génère un code QR unique
     */
    public function generateQRCode($trackingNumber) {
        return hash('sha256', $trackingNumber . time() . mt_rand());
    }
    
    /**
     * Calcule le coût d'expédition
     */
    public function calculateShippingCost($weight, $destination) {
        $rates = [
            'Port-au-Prince' => 3.5,
            'Cap-Haïtien' => 4.0,
            'Les Cayes' => 6.0
        ];
        
        $fixedFee = 10.0;
        $ratePerLb = $rates[$destination] ?? 3.5;
        
        return ($weight * $ratePerLb) + $fixedFee;
    }
    
    /**
     * Estime la date d'arrivée
     */
    public function estimateArrivalDate($destination) {
        $days = [
            'Port-au-Prince' => 5,
            'Cap-Haïtien' => 8,
            'Les Cayes' => 12
        ];
        
        $daysToAdd = $days[$destination] ?? 7;
        return date('Y-m-d', strtotime("+{$daysToAdd} days"));
    }
}
?>