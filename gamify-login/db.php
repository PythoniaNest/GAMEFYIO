<?php

$conn = mysqli_connect("localhost","root","","gamify_db");

if(!$conn){
    die("Connection failed: " . mysqli_connect_error());
}

?>