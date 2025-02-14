<?php
require(__DIR__ . "/../config/DBConnection.php");
session_start();

$current_user_id = $_SESSION['currentUserId'];

if (isset($_POST['friend_id'])) {
    $friend_id = $_POST['friend_id'];

    if (isset($_POST['accept'])) {
        // Accept friend request
        $updateQuery = $pdo->prepare("
            UPDATE friends 
            SET status = 'accepted' 
            WHERE user_id1 = :friend_id AND user_id2 = :current_user_id
        ");
    } elseif (isset($_POST['reject'])) {
        // Reject friend request
        $updateQuery = $pdo->prepare("
            DELETE FROM friends 
            WHERE user_id1 = :friend_id AND user_id2 = :current_user_id
        ");
    }

    if (isset($updateQuery)) {
        $updateQuery->execute([
            'friend_id' => $friend_id,
            'current_user_id' => $current_user_id
        ]);
    }
}

// Redirect back to the page after handling
header("Location: ../../client/discoverPeoplePage.php");
exit();
