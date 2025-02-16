<?php
require(__DIR__ . "/../config/DBConnection.php");
session_start();

$current_user_id = $_SESSION['currentUserId'];
$user_id = $_GET['user_id'] ?? null;

if ($user_id) {
    $query = $pdo->prepare("SELECT user_id, firstName, lastName, profile_picture, email, is_online, address FROM users WHERE user_id = :user_id");
    $query->execute(['user_id' => $user_id]);
    $user = $query->fetch(PDO::FETCH_ASSOC);

    // Check friendship status
    $friendshipQuery = $pdo->prepare("
        SELECT status 
        FROM friends 
        WHERE (user_id1 = :current_user AND user_id2 = :profile_user)
           OR (user_id1 = :profile_user AND user_id2 = :current_user)
    ");
    $friendshipQuery->execute([
        'current_user' => $current_user_id,
        'profile_user' => $user_id
    ]);

    $friendship = $friendshipQuery->fetch(PDO::FETCH_ASSOC);
    $friendshipStatus = $friendship['status'] ?? null; // Could be 'accepted', 'pending', or null if no relationship
} else {
    echo "No user specified!";
    exit;
}

