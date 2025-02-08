<?php

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles/messagePage.css?v=<?php echo time(); ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <title>Messages</title>
</head>
<body>
    <?php include('templates/navbar.php'); ?>
    <section class="background">
        <div class="list-container">
            <div class="search-bar-container">
                <form class="search-bar">
                    <div>
                        <img src="images/icons/search_icon.png" alt="search">
                    </div>
                    <div>
                        <input type="text" name="search" id="search" placeholder="Search People">
                    </div>
                </form>
            </div>
            <div class="message-list-container">
                <button class="message-list" name="goToMsg" onclick="window.location.href='messageTab.php'">
                    <div class="message-pic">
                        <img src="images/profile_img/profile_1.jpg" alt="img">
                    </div>
                    <div class="message-preview-container">
                        <div class="name-time">
                        <h2>James Oliver</h2> 
                        <h2>9:32</h2>
                        </div>
                        <div>
                        <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum quam reiciendis optio ab. Repudiandae dolore amet totam consequatur non veritatis quia doloremque autem, nesciunt voluptatibus quas rerum tempora aut vel.</h3>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    </section>
</body>
</html>