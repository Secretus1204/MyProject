<?php
require(__DIR__ . "/../config/DBConnection.php");
session_start();
$current_user_id = $_SESSION['currentUserId'];

// Fetch Online Non-Friends
$queryNonFriends = $pdo->prepare("
    SELECT u.user_id, u.firstName, u.lastName, u.profile_picture 
    FROM users u
    WHERE u.is_online = 1 
    AND u.user_id != :current_user_id
    AND u.user_id NOT IN (
        SELECT CASE 
                WHEN f.user_id1 = :current_user_id THEN f.user_id2 
                ELSE f.user_id1 
               END 
        FROM friends f 
        WHERE (f.user_id1 = :current_user_id OR f.user_id2 = :current_user_id) 
        AND f.status = 'accepted'
    )
");
$queryNonFriends->execute(['current_user_id' => $current_user_id]);
$nonFriends = $queryNonFriends->fetchAll(PDO::FETCH_ASSOC);

// Fetch Online Friends
$queryFriends = $pdo->prepare("
    SELECT DISTINCT u.user_id, u.firstName, u.lastName, u.profile_picture 
    FROM users u
    JOIN friends f ON (u.user_id = f.user_id1 OR u.user_id = f.user_id2)
    WHERE u.is_online = 1 
    AND (f.user_id1 = :current_user_id OR f.user_id2 = :current_user_id)
    AND u.user_id != :current_user_id
    AND f.status = 'accepted'
");

$queryFriends->execute(['current_user_id' => $current_user_id]);
$friends = $queryFriends->fetchAll(PDO::FETCH_ASSOC);

