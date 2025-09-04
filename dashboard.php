<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: index.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Panel de Jugador</title>
</head>
<body>
  <h1>Bienvenido, <?php echo $_SESSION['username']; ?> 🎮</h1>
  <a href="logout.php">Cerrar sesión</a>
</body>
</html>
