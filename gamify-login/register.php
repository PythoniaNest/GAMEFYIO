<?php
include "db.php";

if (isset($_POST['register'])) {

    $fullname = $_POST['fullname'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO users(fullname,email,password)
VALUES('$fullname','$email','$password')";

    if (mysqli_query($conn, $sql)) {
        echo "Registration Successful";
        header("Location:index.php");
    } else {
        echo "Error";
    }
}
