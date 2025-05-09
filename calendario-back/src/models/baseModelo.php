<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

abstract class BaseModelo
{
    protected function ejecutarSp($query, $params = [])
    {
        $conexion = new conexion();
        $sql = $conexion->test()->prepare($query);

        // if (!empty($params)) {
        //     $sql->bind_param(...$params);
        // }

        if (!empty($params)) {
            $tipos = array_shift($params); // Extrae "s", "si", etc.
            $sql->bind_param($tipos, ...$params);
        }
        
        $sql->execute();
        $result = $sql->get_result();
        $sql->close();

        return $result;
    }

    protected function responderJson($respuesta)
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($respuesta);
        exit;
    }

    protected function obtenerCorreoDesdeToken() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];

            try {
                $decoded = JWT::decode($token, new Key('CLAVE_SECRETA_SEGURA', 'HS256'));
                return $decoded->data->correo ?? null;
            } catch (Exception $e) {
                http_response_code(401);
                echo json_encode(["error" => "Token inválido"]);
                exit;
            }
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Token no proporcionado"]);
            exit;
        }
    }


}


?>