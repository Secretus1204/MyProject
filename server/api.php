<?php
header("Access-Control-Allow-Origin: *"); // Allow external access
header("Content-Type: application/json");

$servername = "sql301.infinityfree.com"; // Your MySQL host
$username = "if0_38467642"; // Your MySQL username
$password = "9C8XtLxQWgEyE0h"; // Your MySQL password
$database = "if0_38467642_yaphub"; // Your MySQL database name

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $sql = "SELECT * FROM users"; // Example query
    $result = $conn->query($sql);
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
}

$conn->close();
?>
