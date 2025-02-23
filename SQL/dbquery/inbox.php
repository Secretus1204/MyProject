<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
require(__DIR__ . "/../config/DBConnection.php");

if (!isset($_SESSION['currentUserId'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$userId = $_SESSION['currentUserId'];

try {
    $sql = "
    SELECT u.user_id, u.firstName, u.lastName, u.profile_picture,
        NULL AS chat_id,
        NULL AS message_text,
        NULL AS created_at
    FROM friends f
    JOIN users u ON (u.user_id = f.user_id1 OR u.user_id = f.user_id2)
    WHERE (f.user_id1 = :userId OR f.user_id2 = :userId)
        AND u.user_id != :userId
        AND f.status = 'accepted'
    GROUP BY u.user_id, u.firstName, u.lastName, u.profile_picture
    ORDER BY u.firstName ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['userId' => $userId]);
    $inbox = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($inbox);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
