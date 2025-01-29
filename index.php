<?php
    require("config/DBConnection.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles/login.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <title>YapHub</title>
</head>
<body>
    <Section class="createaccount">
        <div class="logo">
            <div class="img_bg">
            <img src="images/logo/yaphub_logo.png" alt="logo">
            </div>
        </div>
        <div class="forms">
            <h1>Create Account</h1>
            <h2 class="error">This is an error message!</h2>
            <form class="formInput" action="dbquery/signupDB.php" method="POST">
                <input class="inputs" type="text" name="name" id="name" placeholder="Name" required>
                <input class="inputs" type="email" name="email" id="email" placeholder="Email" required>
                <input class="inputs" type="password" name="password" id="password" placeholder="Password" required>
                <input class="submitbtn" type="submit" name="submit" id="submit" placeholder="Create Account">
            </form>
            <h3>Already have an account? <a href="login.php">Login here</a></h3>
        </div>
    </Section>
</body>
</html>