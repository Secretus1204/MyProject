<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
require(__DIR__ . "/../config/DBConnection.php");

$userId = $_SESSION['currentUserId'];

try {
    $sql = "
    SELECT c.chat_id, c.chat_name, c.group_picture, MAX(m.message_text) AS message_text, MAX(m.created_at) AS created_at
    FROM chat_members cm
    JOIN chats c ON cm.chat_id = c.chat_id
    LEFT JOIN messages m ON m.chat_id = c.chat_id
    WHERE cm.user_id = :userId AND c.is_group = 1
    GROUP BY c.chat_id, c.chat_name, c.group_picture
    ORDER BY MAX(m.created_at) DESC, c.chat_name ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['userId' => $userId]);
    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($groups);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
