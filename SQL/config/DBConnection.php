<?php
$servername = "sql301.infinityfree.com";
$username = "if0_38467642";
$password = "9C8XtLxQWgEyE0h";
$db_name = "if0_38467642_yaphub";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$db_name;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
