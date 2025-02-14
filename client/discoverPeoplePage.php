<?php
    include('../SQL/client_include/discoverPeople.inc.php');   
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles/discoverPeoplePage.css?v=<?php echo time(); ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <title>Discover People</title>
</head>
<body>
    <?php include('templates/navbar.php'); ?>
    <section class="background">
        <div class="main-container">
            <div class="current-friends-container">
                <div class="current-friends-header">
                    <h1>Current Friends</h1>
                </div>
                <div class="current-friends-list">
                    <!-- to display friend accounts -->
                    <?php foreach ($friends as $friend): ?>
                        <button class="current-friend">
                            <div class="profile-current-friend">
                                <img src="images/profile_img/profile_1.jpg" alt="profile">
                            </div>
                            <div class="name-current-friend">
                                <h3><?php echo htmlspecialchars($friend['firstName'] . ' ' . $friend['lastName']); ?></h3>
                            </div>
                            <div class="online-or-not">
                                <?php if ($friend['is_online'] == 1): ?>
                                    <span class="online-status online">Online</span>
                                <?php else: ?>
                                    <span class="online-status offline">Offline</span>
                                <?php endif; ?>
                            </div>
                        </button>
                    <?php endforeach; ?>
                </div>
            </div>
            <div class="search-people-container">
                <div class="search-container">
                    <input type="text" name="search" id="search" placeholder="Search">
                </div>
                <div class="suggested-friends">
                    <!-- to display non-friend accounts -->
                    <?php foreach ($nonFriends as $nonfriend): ?>
                    <div class="profile-container">
                        <div class="profile-img">
                            <img src="images/profile_img/profile_1.jpg" alt="profile">
                        </div>
                        <div class="name">
                            <h2><?php echo htmlspecialchars($nonfriend['firstName'] . ' ' . $nonfriend['lastName']); ?></h2>
                        </div>
                        <?php if ($nonfriend['is_pending'] == 0): ?>
                            <form action="../SQL/dbquery/addFriend.php" method="POST">
                                <input type="hidden" name="add_friend_id" value="<?php echo $nonfriend['user_id']; ?>">
                                <button type="submit" class="add-icon">
                                    <img src="images/icons/addUser_icon.png" alt="add">
                                </button>
                            </form>
                        <?php else: ?>
                            <button class="add-icon pending-btn" disabled>
                                <span>Pending</span>
                            </button>
                        <?php endif; ?>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <div class="friend-request-container">
                <div class="friend-request-header">
                    <h1>Friend Request</h1>
                </div>
                <div class="friend-request-list">
                    <!-- to display accounts that sent a pending friend request -->
                    <?php if (empty($friendRequests)): ?>
                        <p>No friend requests.</p>
                    <?php else: ?>
                        <?php foreach ($friendRequests as $request): ?>
                            <div class="fr-profile-container">
                                <div class="fr-profile-img">
                                    <img src="images/profile_img/profile_1.jpg" alt="profile">
                                </div>
                                <div class="fr-name">
                                    <h2><?php echo htmlspecialchars($request['firstName'] . ' ' . $request['lastName']); ?></h2>
                                </div>
                                <form action="../SQL/dbquery/handleFriendRequest.php" method="POST">
                                    <input type="hidden" name="friend_id" value="<?php echo $request['user_id']; ?>">
                                    <button type="submit" name="accept" class="acceptBtn buttons">
                                        <h2>Accept</h2>
                                    </button>
                                    <button type="submit" name="reject" class="rejectBtn buttons">
                                        <h2>Reject</h2>
                                    </button>
                                </form>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>
</body>
</html>