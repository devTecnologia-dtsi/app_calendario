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

            $sql->close();
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function consultarRol($id) {
        try {
            $sql = $this->conn->prepare("CALL sp_rol('ver', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
            $sql->bind_param("i", $id);
            $sql->execute();

            $result = $sql->get_result();
            $datos = array();
            while ($fila = $result->fetch_assoc()) {
                $datos[] = $fila;
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($datos);

            $sql->close();
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function insertarRol($dato) {
        try {
            $crear = isset($dato['crear']) ? $dato['crear'] : 0;
            $leer = isset($dato['leer']) ? $dato['leer'] : 0;
            $actualizar = isset($dato['actualizar']) ? $dato['actualizar'] : 0;
            $borrar = isset($dato['borrar']) ? $dato['borrar'] : 0;
            $actividad = isset($dato['actividad']) ? $dato['actividad'] : 0;
            $subactividad = isset($dato['subactividad']) ? $dato['subactividad'] : 0;
            $calendario = isset($dato['calendario']) ? $dato['calendario'] : 0;
            $sistema = isset($dato['sistema']) ? $dato['sistema'] : 0;
            $nombre = isset($dato['nombre']) ? $dato['nombre'] : null;
            $accion = "insertar";

            $sql = $this->conn->prepare("CALL sp_rol(?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $sql->bind_param("siiiiiiiiss", $accion, $crear, $leer, $actualizar, $borrar, $actividad, $subactividad, $calendario, $sistema, $nombre);
            $sql->execute();

            header('Content-Type: application/json; charset=utf-8');

            if ($sql->affected_rows > 0) {
                echo json_encode(array('mensaje' => 'Nuevo rol insertado correctamente'));
            } else {
                echo json_encode(array('error' => 'Error en la inserción de datos'));
            }

            $sql->close();
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function actualizarRol($id, $dato) {
        try {
            $crear = isset($dato['crear']) ? $dato['crear'] : 0;
            $leer = isset($dato['leer']) ? $dato['leer'] : 0;
            $actualizar = isset($dato['actualizar']) ? $dato['actualizar'] : 0;
            $borrar = isset($dato['borrar']) ? $dato['borrar'] : 0;
            $actividad = isset($dato['actividad']) ? $dato['actividad'] : 0;
            $subactividad = isset($dato['subactividad']) ? $dato['subactividad'] : 0;
            $calendario = isset($dato['calendario']) ? $dato['calendario'] : 0;
            $sistema = isset($dato['sistema']) ? $dato['sistema'] : 0;
            $nombre = isset($dato['nombre']) ? $dato['nombre'] : null;
            $accion = "actualizar";

            $sql = $this->conn->prepare("CALL sp_rol(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $sql->bind_param("siiiiiiiiss", $accion, $id, $crear, $leer, $actualizar, $borrar, $actividad, $subactividad, $calendario, $sistema, $nombre);
            $sql->execute();

            header('Content-Type: application/json; charset=utf-8');

            if ($sql->affected_rows > 0) {
                echo json_encode(array('mensaje' => 'Rol actualizado correctamente'));
            } else {
                throw new Exception('No se pudo actualizar el registro');
            }

            $sql->close();
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function eliminarRol($id) {
        try {
            $accion = "eliminar";
            $sql = $this->conn->prepare("CALL sp_rol(?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
            $sql->bind_param("si", $accion, $id);
            $sql->execute();

            header('Content-Type: application/json; charset=utf-8');

            if ($sql->affected_rows > 0) {
                echo json_encode(array('mensaje' => 'Rol eliminado correctamente'));
            } else {
                echo json_encode(array('error' => 'No se eliminó el registro'));
            }

            $sql->close();
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }
}
?>
