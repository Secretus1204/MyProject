<?php
    require("../config/DBConnection.php");
    session_start();
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
            header("Location: ../../client/login.php?error=Email is required!");
            exit();
        }
        else if (empty($password)) {
            header("Location: ../../client/login.php?error=Password is required!");
            exit();
        }
        else {
            $adminResult = mysqli_query($conn,"SELECT * FROM admin WHERE adminEmail = '$email' AND adminPassword = '$password'");
                if(mysqli_num_rows($adminResult) == 1){
                    header("Location: ../../admin/adminPage.php");
                        $_SESSION["email"] = $email;
                        $_SESSION["password"] = $password;
                } else{
                $result = mysqli_query($conn,"SELECT * FROM user WHERE userEmail = '$email' AND userPassword = '$password'");
                    if (mysqli_num_rows($result) == 1) {
                        header("Location: ../../client/profilePage.php");
                        $_SESSION["email"] = $email;
                        $_SESSION["password"] = $password;
                    } else {
                        header("Location: ../../client/login.php?error=Wrong login details!");
                        exit();
                    }
                }
        }

    }
    else{
        header("Location: ../login.php");
        exit();
    }
