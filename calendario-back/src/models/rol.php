<?php

include_once __DIR__ . "/../../config/conexion.php";

class crudRol
{
    private $conn;

    public function __construct() {
        $database = new conexion();
        $this->conn = $database->conexion; 
    }

    public function listarRoles() {
        try {
            $sql = $this->conn->prepare("CALL sp_rol('ver', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
            $sql->execute();
            $result = $sql->get_result();

            $roles = array();
            while ($row = $result->fetch_assoc()) {
                $roles[] = $row;
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($roles);
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function consultarRol($id, $correo) {
        try {
            if (!isset($correo)) {
                $res = array(["error" => " el correo es obligatorio"]);
                echo json_encode($res);
                exit;
            }

            $sql = $this->conn->prepare("select correo from usuario where correo = ?");
            $sql->bind_param("s", $correo);
            $sql->execute();

            $result = $sql->get_result();
            $row = $result->fetch_assoc();

            if (isset($row['correo']) == null) { //si el correo ingresado, no existe arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {
                if($id == null) {
                    $sql = $this->conn->prepare("CALL sp_rol('ver', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?)");
                    $sql->bind_param("s", $correo);
                } else {
                    $sql = $this->conn->prepare("CALL sp_rol('ver', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?)");
                    $sql->bind_param("is", $id, $correo);
                }

                $sql->execute();
                $resultado =  $sql->get_result();

                if ($resultado) {
                    $datos = array(); //mete los datos de cada registro de la base de datos en un arreglo
                    while ($fila = $resultado->fetch_assoc()) { //guarda los datos usando un bucle while y recorriendo el arreglo con fetch_assoc
                        $datos[] = $fila;
                    }
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode($datos);
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function insertarRol($dato, $correo) {
        try {
            if (!isset($correo)) {
                $res = array(["error" => " el correo es obligatorio"]);
                echo json_encode($res);
                exit;
            }

            $sql = $this->conn->prepare("select correo from usuario where correo = ?");
            $sql->bind_param("s", $correo);
            $sql->execute();

            $result = $sql->get_result();
            $row = $result->fetch_assoc();

            if (isset($row['correo']) == null) { //si el correo ingresado no existe, arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {
                $crear = isset($dato['crear']) ? $dato['crear'] : 0;
                $leer = isset($dato['leer']) ? $dato['leer'] : 0;
                $actualizar = isset($dato['actualizar']) ? $dato['actualizar'] : 0;
                $borrar = isset($dato['borrar']) ? $dato['borrar'] : 0;
                $actividad = isset($dato['actividad']) ? $dato['actividad'] : 0;
                $subactividad = isset($dato['subactividad']) ? $dato['subactividad'] : 0;
                $calendario = isset($dato['calendario']) ? $dato['calendario'] : 0;
                $sistema = isset($dato['sistema']) ? $dato['sistema'] : 0;
                $nombre = isset($dato['nombre']) ? $dato['nombre'] : null;

                $sql = $this->conn->prepare("CALL sp_rol('insertar', NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $sql->bind_param('iiiiiiiiss', $crear, $leer, $actualizar, $borrar, $actividad, $subactividad, $calendario, $sistema, $nombre, $correo);
                $sql->execute();

                $resultado = $sql->get_result();
                header('Content-Type: application/json; charset=utf-8');

                if ($resultado) {
                    echo json_encode(array('mensaje' => 'Nuevo rol insertado correctamente'));
                } else {
                    echo json_encode(array('error' => 'Error en la inserción de datos'));
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function eliminarRol($id, $correo) {
        try {
            if (!isset($id) || !isset($correo)) {
                $res = array(["error" => "El id y el correo son obligatorios."]);
                echo json_encode($res);
                exit;
            }

            $sql = $this->conn->prepare("select correo from usuario where correo = ?");
            $sql->bind_param("s", $correo);
            $sql->execute();
            $result = $sql->get_result();
            $row = $result->fetch_assoc();

            if (isset($row['correo']) == null) { //si el correo ingresado no existe, arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {
                $sql = $this->conn->prepare("CALL sp_rol('eliminar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?)");
                $sql->bind_param('is', $id, $correo);
                $sql->execute();

                $result = $sql->get_result();
                header('Content-Type: application/json; charset=utf-8');

                if ($result) {
                    echo json_encode(array('mensaje' => 'Rol eliminado correctamente'));
                } else {
                    echo json_encode(array('error' => 'No se eliminó el registro'));
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function actualizarRol($id, $dato, $correo) {
        try {
            if (!isset($id) || !isset($correo)) {
                $res = array(["error" => "El id y el correo son obligatorios."]);
                echo json_encode($res);
                exit;
            }

            $sql = $this->conn->prepare("select correo from usuario where correo = ?");
            $sql->bind_param("s", $correo);
            $sql->execute();
            $result = $sql->get_result();
            $row = $result->fetch_assoc();

            if (isset($row['correo']) == null) { // Si el correo ingresado no existe, arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {
                $crear = isset($dato['crear']) ? $dato['crear'] : 0;
                $leer = isset($dato['leer']) ? $dato['leer'] : 0;
                $actualizar = isset($dato['actualizar']) ? $dato['actualizar'] : 0;
                $borrar = isset($dato['borrar']) ? $dato['borrar'] : 0;
                $actividad = isset($dato['actividad']) ? $dato['actividad'] : 0;
                $subactividad = isset($dato['subactividad']) ? $dato['subactividad'] : 0;
                $calendario = isset($dato['calendario']) ? $dato['calendario'] : 0;
                $sistema = isset($dato['sistema']) ? $dato['sistema'] : 0;
                $nombre = isset($dato['nombre']) ? $dato['nombre'] : null;

                $sql = $this->conn->prepare("CALL sp_rol('actualizar', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $sql->bind_param("iiiiiiiisss", $id, $crear, $leer, $actualizar, $borrar, $actividad, $subactividad, $calendario, $sistema, $nombre, $correo);
                $sql->execute();

                $resultado =  $sql->get_result();
                header('Content-Type: application/json; charset=utf-8');

                if ($resultado) {
                    echo json_encode(array('mensaje' => 'Rol actualizado correctamente'));
                } else {
                    throw new Exception('No se pudo actualizar el registro');
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }
}

// Ejecutar la solicitud
$controller = new crudRol();
$controller->listarRoles();
?>
