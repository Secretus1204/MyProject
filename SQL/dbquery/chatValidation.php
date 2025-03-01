<?php
header("Content-Type: application/json");
require_once "../config/database.php"; // Include database connection

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id'], $data['chat_id'])) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit();
}

$user_id = $data['user_id'];
$chat_id = $data['chat_id'];

$query = "SELECT COUNT(*) AS count FROM chat_members WHERE user_id = :user_id AND chat_id = :chat_id";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$stmt->bindParam(':chat_id', $chat_id, PDO::PARAM_INT);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if ($result['count'] > 0) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "User is not a member of this chat"]);
}
?>
