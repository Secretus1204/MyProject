<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

require_once __DIR__ . "/../config/DBConnection.php"; // Fix path issue

if (!isset($_GET['chat_id'])) {
    echo json_encode(["success" => false, "message" => "Chat ID is required"]);
    exit;
}

$chat_id = $_GET['chat_id'];

try {
    $query = "SELECT c.chat_id, c.chat_name, c.group_picture, c.is_group, u.profile_picture, u.firstName, u.lastName
              FROM chats c
              JOIN chat_members cm ON c.chat_id = cm.chat_id
              JOIN users u ON cm.user_id = u.user_id
              WHERE c.chat_id = :chat_id";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":chat_id", $chat_id, PDO::PARAM_INT);
    $stmt->execute();
    $chatDetails = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$chatDetails) {
        echo json_encode(["success" => false, "message" => "Chat not found"]);
        exit;
    }

    $is_group = (bool) $chatDetails[0]['is_group'];
    $chatName = $is_group ? $chatDetails[0]['chat_name'] : ($chatDetails[0]['firstName'] . " " . $chatDetails[0]['lastName']);
    $profileImg = $is_group 
    ? ($chatDetails[0]['group_picture'] ?? 'images/group_img/default_group.jpg') 
    : ($chatDetails[0]['profile_picture'] ?? 'images/profile_img/default_profile.jpg');

    $groupMembers = [];
    if ($is_group) {
        foreach ($chatDetails as $member) {
            $groupMembers[] = $member['firstName'] . " " . $member['lastName'];
        }
    }

    echo json_encode([
        "success" => true,
        "chat_id" => $chat_id,
        "chat_name" => $chatName,
        "profile_picture" => $profileImg,
        "is_group" => $is_group,
        "group_members" => $groupMembers
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}

