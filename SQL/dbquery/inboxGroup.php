<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
require(__DIR__ . "/../config/DBConnection.php");

$userId = $_SESSION['currentUserId'];

try {
    $sql = "
    SELECT c.chat_id, c.chat_name, c.group_picture, 
        m.message_text AS latest_message, 
        m.created_at AS message_timestamp
    FROM chat_members cm
    JOIN chats c ON cm.chat_id = c.chat_id
    LEFT JOIN messages m 
        ON m.chat_id = c.chat_id 
        AND m.created_at = (
            SELECT MAX(created_at) 
            FROM messages 
            WHERE chat_id = c.chat_id
        )
    WHERE cm.user_id = :userId 
    AND c.is_group = 1
    ORDER BY m.created_at DESC, c.chat_name ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['userId' => $userId]);
    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($groups);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
