<?php
    include('../SQL/dbquery/discoverPeople.inc.php');   
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
                    <?php foreach ($nonFriends as $nonfriend): ?>
                        <div class="profile-container">
                            <div class="profile-img">
                                <img src="images/profile_img/profile_1.jpg" alt="profile">
                            </div>
                            <div class="name">
                                <h2><?php echo htmlspecialchars($nonfriend['firstName'] . ' ' . $nonfriend['lastName']); ?></h2>
                            </div>
                            <button class="add-icon">
                                <img src="images/icons/addUser_icon.png" alt="add">
                            </button>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </section>
</body>
</html>