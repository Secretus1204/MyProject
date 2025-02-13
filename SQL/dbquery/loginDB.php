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
            //check if the account details exits
            $adminResult = mysqli_query($conn,"SELECT * FROM admin WHERE adminEmail = '$email' AND adminPassword = '$password'");
                //if admin
                if(mysqli_num_rows($adminResult) == 1){
                        $row = mysqli_fetch_assoc($adminResult); // Fetch the row as an associative array

                        // Store each column in separate variables
                        $adminName = $row['adminName'];
                        $adminEmail = $row['adminEmail'];
                        $adminPassword = $row['adminPassword'];
                        $_SESSION["name"] = $adminName;
                        $_SESSION["email"] = $adminName;
                        $_SESSION["password"] = $password;

                        header("Location: ../../admin/dashboardPage.php");
                }else{
                //if just a user
                $result = mysqli_query($conn,"SELECT * FROM user WHERE userEmail = '$email' AND userPassword = '$password'");
                    if (mysqli_num_rows($result) == 1) {
                        $row = mysqli_fetch_assoc($result); // Fetch the row as an associative array

                        // Store each column in separate variables
                        $userFirstName = $row['userFirstName'];
                        $userLastName = $row['userLastName'];
                        $userEmail = $row['userEmail'];
                        $userAddress = $row['userAddress'];
                        $userPassword = $row['userPassword'];

                        $_SESSION["firstName"] = $userFirstName;
                        $_SESSION["lastName"] = $userLastName;
                        $_SESSION["email"] = $userEmail;
                        $_SESSION["address"] = $userAddress;
                        $_SESSION["password"] = $userPassword;

                        header("Location: ../../client/profilePage.php");
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
