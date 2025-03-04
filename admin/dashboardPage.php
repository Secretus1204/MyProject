<?php
    session_start();
    if (!isset($_SESSION['adminName'])) {
    header("Location: ../client/index.php");
    exit;
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="adminStyles/dashboardPage.css?v=<?php echo time(); ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <title>Admin Dashboard</title>
</head>
<body>
    <?php include('adminTemplates/adminNavbar.php'); ?>
    <section class="background">
        <div class="header">
            <h1>Dasboard</h1>
        </div>
        <div class="adminName">
            <h1>Hello there, <?= $_SESSION["adminName"]?>!</h1>
        </div>
        <div class="numerical-info-container">
            <div class="total-users info">
                <h3>Total Users</h3>
                <h2>200</h2>
            </div>
            <div class="current-online-users info">
                <h3>Current Online Users</h3>
                <h2>21</h2>
            </div>
            <div class="total-messages-sent info">
                <h3>Total Messages Sent</h3>
                <h2>3500</h2>
            </div>
            <div class="banned-users info">
                <h3>Banned Users</h3>
                <h2>5000</h2>
            </div>
        </div>
    </section>
</body>
</html>