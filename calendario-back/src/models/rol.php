<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ ."/../..//config/cors.php";

class Rol {
    private function ejecutarSP($query, $params = []) {
        $conexion = new conexion();
        $sql = $conexion->test()->prepare($query);

        if (!empty($params)) {
            $sql->bind_param(...$params);
        }

        $sql->execute();
        $result = $sql->get_result();
        $sql->close();

        return $result;
    }

    private function responderJson($respuesta)  {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($respuesta);
        exit;
    }

    public function listarRol() {
        try {
            // Llamada al SP
            // $sql = $conexion->test()->prepare("CALL sp_rol('listar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sistema@uniminuto.edu')");
            $result = $this->ejecutarSP("CALL sp_rol('listar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");

            // Obtener roles
            $roles = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            // Respuesta
            $this->responderJson([
                'status' => 1,
                'message' => 'Roles listados correctamente',
                'data' => $roles 
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar roles: ' . $e->getMessage()
            ]);
        }
    }

    public function consultarRol($id) {
        try {
            // Llamada al SP
            $result = $this->ejecutarSP("CALL sp_rol('obtener', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)",
            ["i", $id]);
            $rol = $result->fetch_assoc();
            $result->close();

            // Respuesta
            if ($rol) {
                $this->responderJson([
                    'status' => 1,
                    'message' => 'Rol consultado correctamente',
                    'data' => $rol
                ]);
            } else {
                $this->responderJson([
                    'status' => 0,
                    'message' => 'Rol no encontrado'
                ]);

            }
         } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al consultar rol: ' . $e->getMessage()
            ]);
         }
    }

    public function actualizarRol($id, $dato) {
        try {
            // Llamada al SP
            $result = $this->ejecutarSP(
                "CALL sp_rol('actualizar', ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)",
                [
                    'iiiiiiiii',
                    $id,
                    $dato['crear'],
                    $dato['leer'],
                    $dato['actualizar'],
                    $dato['borrar'],
                    $dato['actividad'],
                    $dato['subactividad'],
                    $dato['calendario'],
                    $dato['sistema']
                ]
            );
    
            // Capturar respuesta del SP
            $respuesta = $result->fetch_assoc();
            $result->close();
    
            // Verificar respuesta
            if ($respuesta) {
                $this->responderJson([
                    'status' => 1,
                    'message' => $respuesta['message'] ?? 'Rol actualizado correctamente'
                ]);
            } else {
                $this->responderJson([
                    'status' => 0,
                    'message' => 'Error al actualizar el rol'
                ]);
            }
    
        } catch (Exception $e) {
            http_response_code(400);
            $this->responderJson([
                'error' => true,
                'message' => 'Error al actualizar rol: ' . $e->getMessage()
            ]);
        }
    }
    
}

// class crudRol
// {
//     private $conn;

//     public function __construct() {
//         $database = new conexion();
//         $this->conn = $database->conexion; 
//     }

//     public function listarRoles() {
//         try {
//             $sql = $this->conn->prepare("CALL sp_rol('ver', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
//             $sql->execute();
//             $result = $sql->get_result();

//             $roles = array();
//             while ($row = $result->fetch_assoc()) {
//                 $roles[] = $row;
//             }

//             header('Content-Type: application/json; charset=utf-8');
//             echo json_encode($roles);

//             $sql->close();
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }

//     public function consultarRol($id) {
//         try {
//             $sql = $this->conn->prepare("CALL sp_rol('ver', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
//             $sql->bind_param("i", $id);
//             $sql->execute();

//             $result = $sql->get_result();
//             $datos = array();
//             while ($fila = $result->fetch_assoc()) {
//                 $datos[] = $fila;
//             }

//             header('Content-Type: application/json; charset=utf-8');
//             echo json_encode($datos);

//             $sql->close();
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }

//     public function insertarRol($dato) {
//         try {
//             $crear = isset($dato['crear']) ? $dato['crear'] : 0;
//             $leer = isset($dato['leer']) ? $dato['leer'] : 0;
//             $actualizar = isset($dato['actualizar']) ? $dato['actualizar'] : 0;
//             $borrar = isset($dato['borrar']) ? $dato['borrar'] : 0;
//             $actividad = isset($dato['actividad']) ? $dato['actividad'] : 0;
//             $subactividad = isset($dato['subactividad']) ? $dato['subactividad'] : 0;
//             $calendario = isset($dato['calendario']) ? $dato['calendario'] : 0;
//             $sistema = isset($dato['sistema']) ? $dato['sistema'] : 0;
//             $nombre = isset($dato['nombre']) ? $dato['nombre'] : null;
//             $accion = "insertar";

//             $sql = $this->conn->prepare("CALL sp_rol(?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
//             $sql->bind_param("siiiiiiiiss", $accion, $crear, $leer, $actualizar, $borrar, $actividad, $subactividad, $calendario, $sistema, $nombre);
//             $sql->execute();

//             header('Content-Type: application/json; charset=utf-8');

//             if ($sql->affected_rows > 0) {
//                 echo json_encode(array('mensaje' => 'Nuevo rol insertado correctamente'));
//             } else {
//                 echo json_encode(array('error' => 'Error en la inserción de datos'));
//             }

//             $sql->close();
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }

//     public function actualizarRol($id, $dato) {
//         try {
//             $crear = isset($dato['crear']) ? $dato['crear'] : 0;
//             $leer = isset($dato['leer']) ? $dato['leer'] : 0;
//             $actualizar = isset($dato['actualizar']) ? $dato['actualizar'] : 0;
//             $borrar = isset($dato['borrar']) ? $dato['borrar'] : 0;
//             $actividad = isset($dato['actividad']) ? $dato['actividad'] : 0;
//             $subactividad = isset($dato['subactividad']) ? $dato['subactividad'] : 0;
//             $calendario = isset($dato['calendario']) ? $dato['calendario'] : 0;
//             $sistema = isset($dato['sistema']) ? $dato['sistema'] : 0;
//             $nombre = isset($dato['nombre']) ? $dato['nombre'] : null;
//             $accion = "actualizar";

//             $sql = $this->conn->prepare("CALL sp_rol(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
//             $sql->bind_param("siiiiiiiiss", $accion, $id, $crear, $leer, $actualizar, $borrar, $actividad, $subactividad, $calendario, $sistema, $nombre);
//             $sql->execute();

//             header('Content-Type: application/json; charset=utf-8');

//             if ($sql->affected_rows > 0) {
//                 echo json_encode(array('mensaje' => 'Rol actualizado correctamente'));
//             } else {
//                 throw new Exception('No se pudo actualizar el registro');
//             }

//             $sql->close();
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }

//     public function eliminarRol($id) {
//         try {
//             $accion = "eliminar";
//             $sql = $this->conn->prepare("CALL sp_rol(?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
//             $sql->bind_param("si", $accion, $id);
//             $sql->execute();

//             header('Content-Type: application/json; charset=utf-8');

//             if ($sql->affected_rows > 0) {
//                 echo json_encode(array('mensaje' => 'Rol eliminado correctamente'));
//             } else {
//                 echo json_encode(array('error' => 'No se eliminó el registro'));
//             }

//             $sql->close();
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }
// }
?>
