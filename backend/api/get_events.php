<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
include '../config.php';

$neighborhood = isset($_GET['neighborhood']) ? $_GET['neighborhood'] : null;

$sql = "SELECT * FROM events";

if ($neighborhood) {
    $sql .= " WHERE location = :neighborhood";
}

try {
    $stmt = $pdo->prepare($sql);
    if ($neighborhood) {
        $stmt->bindParam(':neighborhood', $neighborhood);
    }
    $stmt->execute();
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($events);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch events: ' . $e->getMessage()]);
}
?>
