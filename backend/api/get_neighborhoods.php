<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
include '../config.php';

try {
    $newsStmt = $pdo->query("SELECT DISTINCT location FROM news ORDER BY location");
    $newsNeighborhoods = $newsStmt->fetchAll(PDO::FETCH_COLUMN);

    $eventsStmt = $pdo->query("SELECT DISTINCT location FROM events ORDER BY location");
    $eventsNeighborhoods = $eventsStmt->fetchAll(PDO::FETCH_COLUMN);

    $alertsStmt = $pdo->query("SELECT DISTINCT location FROM alerts ORDER BY location");
    $alertsNeighborhoods = $alertsStmt->fetchAll(PDO::FETCH_COLUMN);

    $allNeighborhoods = array_unique(array_merge($newsNeighborhoods, $eventsNeighborhoods, $alertsNeighborhoods));
    sort($allNeighborhoods);

    echo json_encode(array_values($allNeighborhoods));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch neighborhoods: ' . $e->getMessage()]);
}
?>
