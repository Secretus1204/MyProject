<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../config/DBConnection.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id'], $data['chat_id'], $data['text'])) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit();
}

$user_id = $data['user_id'];
$chat_id = $data['chat_id'];
$text = $data['text'];

$query = "INSERT INTO messages (chat_id, sender_id, message_text, message_type, file_url, created_at) 
          VALUES (:chat_id, :user_id, :message_text, 'text', NULL, NOW())";

$stmt = $pdo->prepare($query);
$stmt->bindParam(':chat_id', $chat_id, PDO::PARAM_INT);
$stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$stmt->bindParam(':message_text', $text, PDO::PARAM_STR);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to store message"]);
}
?>
