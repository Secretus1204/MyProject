<?php
    session_start();
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
        <div class="inbox-container">
            <div class="search-inbox-container">
                <input type="text" name="searchInbox" id="searchInbox" placeholder="Search">
            </div>
            <div class="last-chat-header">
                <h3>Last Chats</h3>
            </div>
            <div class="inbox">
                <!-- diri sulod ang inbox sa previous messages sa friend or if walay msg friends lang -->
            </div>
        </div>
        <div class="main-message-container">
            <div class="main-message">
                <div class="dateSent">
                    <h3>February 13, 2025</h3>
                </div>
                <div class="message-others">
                    <img src="images/profile_img/default_profile.jpg" alt="chathead">
                    <div>
                    <h3>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quae et molestias illo minus sequi nesciunt quo dignissimos vero obcaecati distinctio, doloremque, quibusdam, assumenda atque veniam veritatis in impedit dolorem.</h3>
                    </div>
                </div>
                <div class="dateSent">
                    <h3>February 14, 2025</h3>
                </div>
                <div class="message-me">
                    <div>
                    <h3>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore impedit, ducimus fuga unde ipsum adipisci inventore illum maxime eveniet corporis, tempora aliquid expedita ex earum reiciendis? Corrupti nemo ducimus voluptate?</h3>
                    </div>
                </div>
            </div>
            <div class="send-message-container">
                <div class="activity">
                    <h3>Someone is typing...</h3>
                </div>
                <div class="send-message">
                    <div class="type-message">
                        <form action="">
                        <textarea name="message" id="message" placeholder="Type a message..."      rows="1" ></textarea>
                        </form>
                    </div>
                    <button class="send-icon">
                        <img src="images/icons/send_icon.png" alt="send">
                    </button>
                </div>
            </div>
        </div>
        <div class="message-info-container">
            <div class="profile-container">
                <div class="profile">
                    <img src="images/profile_img/default_profile.jpg" alt="profile">
                    <div class="online">
                    </div>
                </div>
                <div class="profileName">
                    <h2>James Oliver</h2>
                </div>
            </div>
            <div class="extras">
            <button class="create-chat">
                <h2>Create a group </h2>
            </button>
            </div>
        </div>
    </section>
    <script src="jsFiles/inboxLoader.js?v=<?php echo time(); ?>"></script>
</body>
</html>