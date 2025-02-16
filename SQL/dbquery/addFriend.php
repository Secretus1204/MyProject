<?php
require(__DIR__ . "/../config/DBConnection.php");
session_start();

$current_user_id = $_SESSION['currentUserId'];

if (isset($_POST['add_friend_id'])) {
    $friend_id = $_POST['add_friend_id'];

    try {
        // Check if a friend request already exists
        $checkQuery = $pdo->prepare("
            SELECT * FROM friends 
            WHERE (user_id1 = :current_user_id AND user_id2 = :friend_id) 
               OR (user_id1 = :friend_id AND user_id2 = :current_user_id)
        ");
        $checkQuery->execute([
            'current_user_id' => $current_user_id,
            'friend_id' => $friend_id
        ]);

        $existingRequest = $checkQuery->fetch(PDO::FETCH_ASSOC);

        if (!$existingRequest) {
            // Insert a friend request with status "pending"
            $insertQuery = $pdo->prepare("
                INSERT INTO friends (user_id1, user_id2, status) 
                VALUES (:current_user_id, :friend_id, 'pending')
            ");
            $insertQuery->execute([
                'current_user_id' => $current_user_id,
                'friend_id' => $friend_id
            ]);
        } else {
            // Optional: You can handle cases if a request already exists (e.g., show a message)
        }

        // Redirect back to the discover page
        header("Location: ../../client/discoverPeoplePage.php");
        exit();
    } catch (PDOException $e) {
        // Redirect with error message if something goes wrong
        header("Location: ../../client/discoverPeoplePage.php?error=" . urlencode($e->getMessage()));
        exit();
    }
} else {
    http_response_code(200);
    exit();
}
