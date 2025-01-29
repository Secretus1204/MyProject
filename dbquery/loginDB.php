<?php
    require("../config/DBConnection.php");

    if (isset($_POST['submit'])){

        $email = $_POST['email'];
        $password = $_POST['password'];

        function validate ($data){
            $data = trim ($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }

        $email = validate($_POST ['email']);
        $password = validate($_POST ['password']);

        if(empty($email)){
            header("Location: ../login.php?error=Email is required!");
            exit();
        }
        else if (empty($password)) {
            header("Location: ../login.php?error=Password is required!");
            exit();
        }
        else {
           $result = mysqli_query($conn,"SELECT * FROM users WHERE email = '$email' AND password = '$password'");
            if (mysqli_num_rows($result) == 1) {
                header("Location: ../maindashboard.php");
            } else {
                header("Location: ../login.php?error=Wrong login details!");
                exit();
            }
        }

    }
    else{
        header("Location: ../login.php");
        exit();
    }
