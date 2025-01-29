<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $db_name = "cst5";
    $conn = mysqli_connect($servername, $username, $password,$db_name);

    if ($conn){
        echo "";
    }
    else{
        echo "Connection Failed";
    }
?>