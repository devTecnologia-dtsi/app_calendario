<?php

require_once __DIR__ . "/../../vendor/autoload.php";
include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

abstract class BaseModelo
{
    protected $conexion; // Propiedad global para transacciones

    public function __construct()
    {
        // Cargar variables de entorno si no están cargadas aún
        if (!isset($_ENV['JWT_SECRET'])) {
            $dotenv = Dotenv::createImmutable(__DIR__ . '/../../config/');
            $dotenv->load();
        }

        // Mantener una sola conexión abierta en la clase
        $conexionObj = new conexion();
        $this->conexion = $conexionObj->test();
    }

    // protected function ejecutarSp($query, $params = [])
    // {
    //     $sql = $this->conexion->prepare($query);

    //     if (!empty($params)) {
    //         $tipos = array_shift($params);
    //         $sql->bind_param($tipos, ...$params);
    //     }

    //     $sql->execute();
    //     $result = $sql->get_result();
    //     $sql->close();

    //     return $result;
    // }

    protected function ejecutarSp($query, $params = [])
    {
        // Preparar la sentencia
        $stmt = $this->conexion->prepare($query);
        if ($stmt === false) {
            $err = $this->conexion->error;
            error_log("Error preparando SP: {$query} -> {$err}");
            throw new Exception("Error preparando la consulta: $err");
        }

        // Vincular parámetros si existen
        if (!empty($params)) {
            // El primer elemento del array es la cadena de tipos (por ejemplo: 'iiss')
            $types = array_shift($params);

            // Convertir los valores en referencias (bind_param las necesita así)
            $refs = [];
            foreach ($params as $key => $value) {
                $refs[$key] = &$params[$key];
            }

            // Agregar la cadena de tipos al inicio
            array_unshift($refs, $types);

            // Llamar a bind_param de forma dinámica
            if (!call_user_func_array([$stmt, 'bind_param'], $refs)) {
                $err = $stmt->error;
                error_log("Error en bind_param: {$err} | Query: {$query} | Tipos: {$types}");
                throw new Exception("Error al vincular parámetros: $err");
            }
        }

        // Ejecutar el procedimiento
        if (!$stmt->execute()) {
            $err = $stmt->error;
            error_log("Error ejecutando SP: {$query} -> {$err}");
            throw new Exception("Error al ejecutar la consulta: $err");
        }

        // Obtener resultado si existe
        $result = @$stmt->get_result();

        // Cerrar el statement para liberar recursos
        $stmt->close();

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

            $config = require __DIR__ . '/../../config/config.php';
            $secret = $config['jwt_secret'] ?? null;

            if (!$secret) {
                http_response_code(401);
                echo json_encode(["error" => "Token inválido: JWT_SECRET no definido"]);
                exit;
            }

            try {
                $decoded = JWT::decode($token, new Key($secret, 'HS256'));
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

    protected function obtenerDatosDesdeToken() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];

            try {
                $config = require __DIR__ . '/../../config/config.php';

                $secret = $config['jwt_secret'];
                $decoded = JWT::decode($token, new Key($secret, 'HS256'));
                return $decoded->data ?? null;
            } catch (Exception $e) {
                http_response_code(401);
                echo json_encode(["error" => "Token inválido: " . $e->getMessage()]);
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