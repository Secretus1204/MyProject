<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../config/DBConnection.php"; // Adjust path if needed

if (!isset($_GET['chat_id'])) {
    echo json_encode(["success" => false, "message" => "Missing chat_id"]);
    exit();
}

$chat_id = intval($_GET['chat_id']);
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
$last_id = isset($_GET['last_id']) ? intval($_GET['last_id']) : null;

try {
    // Fetch messages with optional pagination
    if ($last_id) {
        $query = "SELECT message_id, sender_id AS user_id, message_text AS text, created_at AS time 
                  FROM messages 
                  WHERE chat_id = :chat_id AND id < :last_id 
                  ORDER BY message_id DESC 
                  LIMIT :limit";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':last_id', $last_id, PDO::PARAM_INT);
    } else {
        $query = "SELECT message_id, sender_id AS user_id, message_text AS text, created_at AS time 
                  FROM messages 
                  WHERE chat_id = :chat_id 
                  ORDER BY message_id DESC 
                  LIMIT :limit";
        $stmt = $pdo->prepare($query);
    }

    $stmt->bindParam(':chat_id', $chat_id, PDO::PARAM_INT);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Reverse the order so the newest messages appear at the bottom
    $messages = array_reverse($messages);

    echo json_encode(["success" => true, "messages" => $messages]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
