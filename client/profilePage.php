<?php

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles/profilePage.css?v=<?php echo time(); ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <title>Profile</title>
</head>
<body>
    <?php include('templates/navbar.php'); ?>
    <section class="background">
            <div class="profile">
                <img src="images/profile_img/profile_1.jpg" alt="prof1">
            </div>
        <div class="info_container">
            <div class="editBtn_Profile">
                <div class="edit_Profbtn">
                    <button onclick="window.location.href='editProfilePage.php'">Edit Profile</button>
                </div>
            </div>
            <div class="bio_name">
                <h1>DM Rashid Ferrer</h1>
                <h2>Davao City, Philippines</h2>
            </div>
            <div class="current">
                <div class="current_group">
                    <h2>Current Groups</h2>
                    <h1>6</h1>
                </div>
                <div class="vl"></div>
                <div class="current_friends">
                    <h2>Current Friends</h2>
                    <h1>6</h1>
                </div>
            </div>
        </div>
    </section>
</body>
</html>