<?php
    require("../config/DBConnection.php");

    if (isset($_POST['submit'])){

        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = $_POST['password'];

        function validate ($data){
            $data = trim ($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }

        $name = validate($_POST ['name']);
        $email = validate($_POST ['email']);
        $password = validate($_POST ['password']);

    
        if(empty($name)){
            header("Location: ../index.php?error= Username is required! ");
            exit();
        }
        else if(empty($email)){
            header("Location: ../index.php?error= Email is required! ");
            exit();
        }
        else if (empty($password)) {
            header("Location: ../index.php?error= Password is required! ");
            exit();
        }
        else {
            $verify_query = mysqli_query($conn,"SELECT email FROM users WHERE email = '$email'");
            if(mysqli_num_rows($verify_query)!=0){
                header("Location: ../index.php?error= Email is already existing!");
            } else{
            mysqli_query($conn,"INSERT INTO users (name, email, password) VALUES ('$name','$email','$password')");
            header("Location: ../login.php");
            }
        }

    }
    else{
        header("Location: ../login.php");
        exit();
    }
