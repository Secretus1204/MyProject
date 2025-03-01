<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../config/DBConnection.php"; // Adjust path if needed

if (!isset($_GET['chat_id'])) {
    echo json_encode(["success" => false, "message" => "Missing chat_id"]);
    exit();
}

$chat_id = intval($_GET['chat_id']);
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
$last_time = isset($_GET['last_time']) ? $_GET['last_time'] : null; // Expecting a timestamp

try {
    if ($last_time) {
        $query = "SELECT message_id, sender_id AS user_id, message_text AS text, created_at AS time 
                  FROM messages 
                  WHERE chat_id = :chat_id AND created_at < :last_time 
                  ORDER BY created_at DESC 
                  LIMIT $limit"; // Use direct integer in LIMIT
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':last_time', $last_time, PDO::PARAM_STR);
    } else {
        $query = "SELECT message_id, sender_id AS user_id, message_text AS text, created_at AS time 
                  FROM messages 
                  WHERE chat_id = :chat_id 
                  ORDER BY created_at DESC 
                  LIMIT $limit"; // Use direct integer in LIMIT
        $stmt = $pdo->prepare($query);
    }

    $stmt->bindParam(':chat_id', $chat_id, PDO::PARAM_INT);
    $stmt->execute();
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    array_reverse($messages);

    echo json_encode(["success" => true, "messages" => $messages]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
