<?php
session_start();
include "db.php";

if (isset($_POST['login'])) {

    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = mysqli_query($conn, $sql);

    $user = mysqli_fetch_assoc($result);

    if ($user && password_verify($password, $user['password'])) {

        $_SESSION['user'] = $user['fullname'];

        header("Location: ../index.php");
    } else {

        echo "<h2>Invalid Email or Password</h2>";
        echo "<a href='index.php'>Go Back</a>";
    }
}
