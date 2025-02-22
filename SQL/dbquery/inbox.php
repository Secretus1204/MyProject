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
    SELECT u.user_id, u.firstName, u.lastName, 
        COALESCE(u.profile_picture, 'default_image.jpg') AS profile_picture,
        c.chat_id,
        m.message_text,
        m.created_at
    FROM friends f
    JOIN users u ON (u.user_id = f.user_id1 OR u.user_id = f.user_id2)
    LEFT JOIN chat_members cm1 ON cm1.user_id = :userId
    LEFT JOIN chat_members cm2 ON cm2.user_id = u.user_id AND cm1.chat_id = cm2.chat_id
    LEFT JOIN chats c ON c.chat_id = cm1.chat_id AND c.is_group = 0
    LEFT JOIN messages m ON m.message_id = (
        SELECT message_id FROM messages 
        WHERE chat_id = c.chat_id 
        ORDER BY created_at DESC 
        LIMIT 1
    )
    WHERE (f.user_id1 = :userId OR f.user_id2 = :userId)
    AND u.user_id != :userId
    AND f.status = 'accepted'
    ORDER BY m.created_at DESC, u.firstName ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['userId' => $userId]);
    $inbox = $stmt->fetchAll(PDO::FETCH_ASSOC);


    header('Content-Type: application/json');
    echo json_encode($inbox);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
