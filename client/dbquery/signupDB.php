<?php
    require("../config/DBConnection.php");

    if (isset($_POST['submit'])){

        $firstName = $_POST['firstName'];
        $lastName = $_POST['lastName'];
        $email = $_POST['email'];
        $address = $_POST['address'];
        $password = $_POST['password'];

        function validate ($data){
            $data = trim ($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }

        $firstName = validate($_POST ['firstName']);
        $lastName = validate($_POST ['lastName']);
        $email = validate($_POST ['email']);
        $address = validate($_POST ['address']);
        $password = validate($_POST ['password']);

    
        if(empty($firstName)){
            header("Location: ../index.php?error= First Name is required! ");
            exit();
        }
        else if(empty($lastName)){
            header("Location: ../index.php?error= Last Name is required! ");
            exit();
        }
        else if(empty($email)){
            header("Location: ../index.php?error= Email is required! ");
            exit();
        }
        else if(empty($address)){
            header("Location: ../index.php?error= Address is required! ");
            exit();
        }
        else if (empty($password)) {
            header("Location: ../index.php?error= Password is required! ");
            exit();
        }
        else {
            $verify_query = mysqli_query($conn,"SELECT userEmail FROM user WHERE userEmail = '$email'");
            if(mysqli_num_rows($verify_query)!=0){
                header("Location: ../index.php?error= Email is already existing!");
            } else{
            mysqli_query($conn,"INSERT INTO user (userFirstName, userLastName, userEmail, userAddress, userPassword) VALUES ('$firstName', '$lastName', '$email', '$address', '$password')");
            header("Location: ../login.php");
            }
        }

    }
    else{
        header("Location: ../login.php");
        exit();
    }
