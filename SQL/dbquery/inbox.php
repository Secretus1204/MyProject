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
    SELECT 
        u.user_id, 
        u.firstName, 
        u.lastName, 
        u.profile_picture, 
        c.chat_id,
        COALESCE(m.message_text, 'No messages yet') AS latest_message,
        m.created_at AS message_timestamp
    FROM friends f
    JOIN users u ON (u.user_id = f.user_id1 OR u.user_id = f.user_id2)
    JOIN chat_members cm1 ON cm1.user_id = :userId
    JOIN chat_members cm2 ON cm2.user_id = u.user_id AND cm1.chat_id = cm2.chat_id
    JOIN chats c ON c.chat_id = cm1.chat_id
    LEFT JOIN (
        SELECT m1.chat_id, m1.message_text, m1.created_at
        FROM messages m1
        WHERE m1.message_id = (
            SELECT m2.message_id 
            FROM messages m2 
            WHERE m2.chat_id = m1.chat_id 
            ORDER BY m2.created_at DESC 
            LIMIT 1
        )
    ) m ON m.chat_id = c.chat_id
    WHERE (f.user_id1 = :userId OR f.user_id2 = :userId)
        AND u.user_id != :userId
        AND f.status = 'accepted'
        AND c.is_group = 0
    GROUP BY u.user_id, u.firstName, u.lastName, u.profile_picture, c.chat_id, m.message_text, m.created_at
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['userId' => $userId]);
    $inbox = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($inbox);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
