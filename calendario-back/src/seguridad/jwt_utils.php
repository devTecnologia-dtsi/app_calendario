<?php

use Firebase\JWT\JWT;

function generarJWT($datos) {
    $secret = "CLAVE_SECRETA_SEGURA"; // CAmbiar por una clave secreta más segura
    $payload = [
        "iss" => "http://localhost:82",
        "aud" => "http://localhost:82",
        "iat" => time(),
        "exp" => time() + 20 * 60, // 1 hora
        "data" => $datos
    ];

    return JWT::encode($payload, $secret, 'HS256');
}
