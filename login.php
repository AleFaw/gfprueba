<?php
include('05config.php');
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = pg_escape_string($db_ls, $_POST['username']);
    $password = md5($_POST['password']);

    $result = pg_query($db_ls, "SELECT * FROM accounts WHERE username='$username' AND password='$password'");
    if (pg_num_rows($result) == 1) {
        $_SESSION['username'] = $username;
        header("Location: dashboard.php");
        exit();
    } else {
        echo "<p style='color:red;'>Usuario o contraseña incorrectos</p>";
    }
}
?>
