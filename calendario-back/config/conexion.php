<?php

// Cargar las variables de entorno desde el archivo .env
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

class conexion
{
    private $server;
    private $user;
    private $password;
    private $database;
    private $port;
    public $conexion;

    public function __construct()
    {
        try {
            // Cargar las variables de entorno
            $dotenv = Dotenv::createImmutable(__DIR__);
            $dotenv->load();

            // Asignar las variables de entorno a las propiedades de la clase
            $this->server = $_ENV['DB_HOST'];
            $this->user = $_ENV['DB_USER'];
            $this->password = $_ENV['DB_PASSWORD'];
            $this->database = $_ENV['DB_NAME'];
            $this->port = $_ENV['DB_PORT'];

            // Crear la conexión
            $this->conexion = new mysqli($this->server, $this->user, $this->password, $this->database, $this->port);
            $this->conexion->set_charset('utf8mb4');

            if ($this->conexion->connect_error) {
                throw new Exception("Error de conexión: " . $this->conexion->connect_error);
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
            exit;
        }
    }

    public function test()
    {
        return $this->conexion;
    }

    public function obtenerDatos($query)
    {
        $resultado = $this->conexion->query($query);
        if ($resultado) {
            return $resultado;
        } else {
            return false;
        }
    }

    public function afectarDatos($sqlstr)
    {
        $this->conexion->query($sqlstr);
        return $this->conexion->affected_rows;
    }
}
