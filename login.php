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
    <Section class="login">
        <div class="logo">
            <div class="img_bg">
            <img src="images/logo/yaphub_logo.png" alt="logo">
            </div>
        </div>
        <div class="forms">
            <h1>Login</h1>
            <?php if (isset($_POST['error'])) { ?>
                <h2 class = "error"><?php echo $_POST['error'];?></h2>
                <?php }?>
            <form class="formInput" action="dbquery/loginDB.php" method="POST">
                <input class="inputs" type="email" name="email" id="email" placeholder="Email" >
                <input class="inputs" type="password" name="password" id="password" placeholder="Password" >
                <input class="submitbtn" type="submit" name="submit" id="submit" value = "Login">
            </form>
            <h3>Don't have an account? <a href="index.php">Create an account</a></h3>
        </div>
    </Section>
</body>
</html>