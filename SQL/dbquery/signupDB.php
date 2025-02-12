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
            header("Location: ../../client/index.php?error= First Name is required! ");
            exit();
        }
        else if(empty($lastName)){
            header("Location: ../../client/index.php?error= Last Name is required! ");
            exit();
        }
        else if(empty($email)){
            header("Location: ../../client/index.php?error= Email is required! ");
            exit();
        }
        else if(empty($address)){
            header("Location: ../../client/index.php?error= Address is required! ");
            exit();
        }
        else if (empty($password)) {
            header("Location: ../../client/index.php?error= Password is required! ");
            exit();
        }
        else {

            // Secure user email check
            $stmtUser = mysqli_prepare($conn, "SELECT userEmail FROM user WHERE userEmail = ?");
            mysqli_stmt_bind_param($stmtUser, "s", $email);
            mysqli_stmt_execute($stmtUser);
            mysqli_stmt_store_result($stmtUser);
            $checkEmailUser = mysqli_stmt_num_rows($stmtUser);
            mysqli_stmt_close($stmtUser);

            // Secure admin email check
            $stmtAdmin = mysqli_prepare($conn, "SELECT adminEmail FROM admin WHERE adminEmail = ?");
            mysqli_stmt_bind_param($stmtAdmin, "s", $email);
            mysqli_stmt_execute($stmtAdmin);
            mysqli_stmt_store_result($stmtAdmin);
            $checkEmailAdmin = mysqli_stmt_num_rows($stmtAdmin);
            mysqli_stmt_close($stmtAdmin);

            if($checkEmailUser != 0){
                header("Location: ../../client/index.php?error= Email is already existing!");
            } else if($checkEmailAdmin != 0){
                header("Location: ../../client/index.php?error= This email is for admin!");
            }else{
            $stmtCreateUser = mysqli_prepare($conn,"INSERT INTO user (userFirstName, userLastName, userEmail, userAddress, userPassword) VALUES (?, ?, ?, ?, ?)");
            if($stmtCreateUser){

                mysqli_stmt_bind_param($stmtCreateUser,"sssss", $firstName, $lastName, $email, $address, $password);

                 // Execute the statement
                if (mysqli_stmt_execute($stmtCreateUser)) {
                    header("Location: ../../client/login.php");
                } else {
                    header("Location: ../../client/index.php?error= Error Occured In Executing Statement!");
                }
            }else{
                header("Location: ../../client/index.php?error= Error Occured!");
            }
            }
        }

    }
    else{
        header("Location: ../login.php");
        exit();
    }
