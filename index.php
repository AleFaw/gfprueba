<?php
include('05config.php');

// Iniciamos la sesi�n para mantener los datos del chat
session_start();

// Mensaje de bienvenida por defecto
$message = 'Bienvenidos';

// Verificar si el formulario de env�o de mensajes ha sido enviado
if(isset($_POST['submit'])) {
    // Obtener el mensaje y el apodo del formulario
    $chat_message = $_POST['chat_message'];
    $nickname = $_POST['nickname'];

    // Construir el mensaje completo con el apodo
    $message = "<strong>$nickname:</strong> $chat_message";

    // Agregar el mensaje al historial de chat en la sesi�n
    if(isset($_SESSION['chat_history'])) {
        $_SESSION['chat_history'] .= "<br>$message";
    } else {
        $_SESSION['chat_history'] = $message;
    }
}

?>

<!DOCTYPE html>
<html lang='en'>

<head>
    <title>Grand fantasia GT</title>
    <meta http-equiv='content-type' content='text/html'; charset='UTF-8' />
    <style>
        body {
            /* Establece la imagen de fondo y ajusta su tama�o */
            background-image: url('fondo1.png'); /* Aseg�rate de que fondo1.jpg est� en la misma ubicaci�n que esta p�gina PHP */
            background-size: cover; /* Ajusta el tama�o de la imagen de fondo para que cubra toda la ventana del navegador */
            background-repeat: no-repeat; /* Evita que la imagen de fondo se repita */
        }

        /* Estilos adicionales si es necesario */
        center {
            margin-top: 20px;
        }

        h3 {
            color: white;
        }

        p {
            color: white;
        }

        .chat-container {
            width: 80%;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.5);
            padding: 10px;
            border-radius: 5px;
        }

        .chat-history {
            height: 300px;
            overflow-y: scroll;
            padding: 5px;
        }

        .chat-message {
            width: 100%;
            padding: 5px;
            margin-top: 10px;
        }

        .chat-nickname {
            width: 20%;
            padding: 5px;
            margin-top: 10px;
        }

        .chat-submit {
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .chat-submit:hover {
            background-color: #45a049;
        }
    </style>
</head>

<body>
    <center>
        <br>
        <h3>Grand Fantasia GT</h3>
        <br>
        <div class="chat-container">
            <div class="chat-history">
                <?php
                // Mostrar el historial de chat si existe en la sesi�n
                if(isset($_SESSION['chat_history'])) {
                    echo $_SESSION['chat_history'];
                }
                ?>
            </div>
            <form method="post" action="">
                <input type="text" name="nickname" placeholder="Tu apodo" class="chat-nickname" required><br>
                <textarea name="chat_message" placeholder="Escribe tu mensaje..." class="chat-message" required></textarea><br>
                <input type="submit" name="submit" value="Enviar" class="chat-submit">
            </form>
        </div>
    </center>
</body>

</html>
