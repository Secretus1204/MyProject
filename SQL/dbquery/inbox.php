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
       MAX(c.chat_id) AS chat_id,
       MAX(m.message_text) AS message_text,
       MAX(m.created_at) AS created_at
        FROM friends f
        JOIN users u ON (u.user_id = f.user_id1 OR u.user_id = f.user_id2)
        LEFT JOIN chat_members cm ON cm.user_id = u.user_id
        LEFT JOIN chat_members cm_self ON cm_self.chat_id = cm.chat_id AND cm_self.user_id = :userId
        LEFT JOIN chats c ON c.chat_id = cm.chat_id AND c.is_group = 0
        LEFT JOIN messages m ON m.chat_id = c.chat_id
        WHERE (f.user_id1 = :userId OR f.user_id2 = :userId)
        AND u.user_id != :userId
        AND f.status = 'accepted'
        GROUP BY u.user_id, u.firstName, u.lastName, u.profile_picture
        ORDER BY MAX(m.created_at) DESC, u.firstName ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['userId' => $userId]);
    $inbox = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($inbox);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
