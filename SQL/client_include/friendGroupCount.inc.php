<?php
require(__DIR__ . "/../config/DBConnection.php");
session_start();

$current_user_id = $_SESSION['currentUserId']; // Get the logged-in user ID

$query = "SELECT COUNT(*) AS friend_count FROM friends WHERE (user_id1 = :userId OR user_id2 = :userId) AND status = 'accepted' ";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':userId', $current_user_id, PDO::PARAM_INT);
$stmt->execute();
$friendCount = $stmt->fetch(PDO::FETCH_ASSOC)['friend_count'];

$query = "SELECT COUNT(*) AS group_count FROM chat_members WHERE user_id = :userId";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':userId', $current_user_id, PDO::PARAM_INT);
$stmt->execute();
$groupCount = $stmt->fetch(PDO::FETCH_ASSOC)['group_count'];

