<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";

// Este modelo es solo para el superadmin
class crudusuario
{
    private function ejecutarSP($query, $params = []){
        $conexion = new conexion();
        $sql = $conexion->test()->prepare($query);
        if(!empty($params)){
            $sql->bind_param(...$params);
        }
        $sql->execute();
        $resultado = $sql->get_result();
        $respuesta = $resultado->fetch_assoc();
        return $respuesta;
    }

    private function responderJson($respuesta){
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($respuesta);
        exit;
    }

    public function consultarUsuario($id)
    {
        try {
            $respuesta = $this->ejecutarSP("CALL sp_usuario('ver_id', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)", ["i", $id]);

            if (!$respuesta) {
                $respuesta = [
                    'status' => 0,
                    'message' => 'Usuario no encontrado',
                    'data' => null
                ];
            } else {
                $respuesta = [
                    'status' => 1,
                    'message' => 'Usuario encontrado',
                    'data' => $respuesta
                ];
            }

            $this->responderJSON($respuesta);
        } catch (Exception $e) {
            http_response_code(400);
            $this->responderJSON([
                'error' => true,
                'message' => $e->getMessage()
            ]);
        }
    }
    // public function consultarUsuario($id)
    // {
    //     try {
    //         $conexion = new conexion();

    //         $sql = $conexion->test()->prepare("CALL sp_usuario('ver_id', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
    //         $sql->bind_param("i", $id);
    //         $sql->execute();
    //         $result = $sql->get_result();
    //         $datos = array();
    //         while ($fila = $result->fetch_assoc()) {
    //             $datos[] = $fila;
    //         }
    //         header('Content-Type: application/json; charset=utf-8');
    //         echo json_encode(count($datos) > 0 ? $datos[0] : null);
    //     } catch (Exception $e) {
    //         http_response_code(400); // 400 para errores del usuario, 500 si es error del servidor
    //         echo json_encode([
    //             'error' => true,
    //             'message' => $e->getMessage()
    //         ]);
    //         exit;
    //     }
    // }

    // public function listarUsuarios() Prueba nueva implementación
    // {
    //     try {
    //         $conexion = new conexion();
    //         $sql = $conexion->test()->prepare("CALL sp_usuario('ver', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
    //         $sql->execute();
    //         $result = $sql->get_result();
    //         $datos = array();
    //         while ($fila = $result->fetch_assoc()) {
    //             $datos[] = $fila;
    //         }

    //         $respuesta = [
    //             'status' => 1,
    //             'message' => 'Usuarios listados correctamente',
    //             'data' => $datos
    //         ];

    //         $this->responderJSON($respuesta);
    //     } catch (Exception $e) {
    //         http_response_code(400);
    //         $this->responderJSON([
    //             'error' => true,
    //             'message' => $e->getMessage()
    //         ]);
    //     }
    // }

    public function listarUsuarios()
    {
        try {
            $conexion = new conexion();
            $sql = $conexion->test()->prepare("CALL sp_usuario('ver', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
            $sql->execute();
            $result = $sql->get_result();
            $datos = array();
            while ($fila = $result->fetch_assoc()) {
                $datos[] = $fila;
            }
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($datos);
        } catch (Exception $e) {
            http_response_code(400); // 400 para errores del usuario, 500 si es error del servidor
            echo json_encode([
                'error' => true,
                'message' => $e->getMessage()
            ]);
            exit;
        }
    }

    public function insertarUsuario($dato)
    {
        try {
            $conexion = new conexion();
            $correo = isset($dato['correo']) ? $dato['correo'] : null;
            $correonuevo = isset($dato['correo']) ? $dato['correo'] : null;
            $estado = isset($dato['estado']) ? $dato['estado'] : null;
            $id_rectoria = isset($dato['id_rectoria']) ? $dato['id_rectoria'] : null;
            $id_sede = isset($dato['id_sede']) ? $dato['id_sede'] : null;
            $fechaIngreso = isset($dato['fechaIngreso']) ? $dato['fechaIngreso'] : null;
            $fechaCreacion = isset($dato['fechaCreacion']) ? $dato['fechaCreacion'] : null;
            $id_rol = isset($dato['id_rol']) ? $dato['id_rol'] : null;

            // Llamamos al SP
            $sql = $conexion->test()->prepare("CALL sp_usuario('insertar', NULL, ?, ?, ?, ?, ?, ?, ?, ?)");
            $sql->bind_param('ssiiissi', $correo, $correonuevo, $estado, $id_rectoria, $id_sede, $fechaIngreso, $fechaCreacion, $id_rol);
            $sql->execute();
            $resultado = $sql->get_result();
            $respuesta = $resultado->fetch_assoc();

            // Obtenemos la respuesta del SP
            header('Content-Type: application/json; charset=utf-8');

            // Respondemos el mensaje que devuelva el SP
            echo json_encode($respuesta);

        } catch (Exception $e) {
            // Manejo de errores
            http_response_code(400);
            echo json_encode([
                'error' => true,
                'message' => $e-> getMessage()
            ]);
            exit;
        }
    }

    public function actualizarUsuario($dato, $id)
    {
        try {
            $conexion = new conexion();
            $correo = isset($dato['correo']) ? $dato['correo'] : null;
            $correonuevo = isset($dato['correo']) ? $dato['correo'] : null;
            $estado = isset($dato['estado']) ? $dato['estado'] : null;
            $id_rectoria = isset($dato['id_rectoria']) ? $dato['id_rectoria'] : null;
            $id_sede = isset($dato['id_sede']) ? $dato['id_sede'] : null;
            $fechaIngreso = isset($dato['fechaIngreso']) ? $dato['fechaIngreso'] : null;
            $fechaCreacion = isset($dato['fechaCreacion']) ? $dato['fechaCreacion'] : null;
            $id_rol = isset($dato['id_rol']) ? $dato['id_rol'] : null;

            // Llamamos al SP
            $sql = $conexion->test()->prepare("CALL sp_usuario('actualizar', ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $sql->bind_param('issiiissi', $id, $correo, $correonuevo, $estado, $id_rectoria, $id_sede, $fechaIngreso, $fechaCreacion, $id_rol);
            $sql->execute();
            $resultado = $sql->get_result();

            // Obtenemos la respuesta del SP
            $respuesta = $resultado->fetch_assoc();

            // Respondemos el mensaje que devuelva el SP
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($respuesta);

        } catch (Exception $e) {
            // Manejo de errores
            http_response_code(400);
            echo json_encode([
                'error' => true,
                'message' => $e->getMessage()
            ]);
            exit;
        }
    }

    public function desactivarUsuario ($id){
        try {

            if(!$id){
                throw new Exception('ID de usuario no proporcionado');
            }
            
            $conexion = new conexion();

            // Llamamos al SP
            $sql = $conexion->test()->prepare("CALL sp_usuario('desactivarUsuario', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
            $sql->bind_param("i", $id);
            $sql->execute();
            $resultado = $sql->get_result();

            // Obtenemos la respuesta del SP
            $respuesta = $resultado->fetch_assoc();

            // Respondemos el mensaje que devuelva el SP
            header('Content-Type: application/json; charset=utf-8');
            if(isset($respuesta['message'])){
                echo json_encode(array('mensaje' => $respuesta['message']));
            } else {
                throw new Exception('Error en la desactivación de usuario');
            }

        }catch(Exception $e){
            // Manejo de errores
            http_response_code(400);
            echo json_encode([
                'error' => true,
                'message' => $e->getMessage()
            ]);
            exit;
        }
    }

    public function eliminarUsuario($id)
    {
        try {
            error_log("ID del usuario a eliminar: " . $id); // Log para verificar el ID
            $conexion = new conexion();
            $sql = $conexion->test()->prepare("CALL sp_usuario('eliminar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
            $sql->bind_param("i", $id);
            $resultado = $sql->execute();
            header('Content-Type: application/json; charset=utf-8');
            if ($resultado) {
                echo json_encode(array('mensaje' => 'Usuario eliminado correctamente'));
            } else {
                throw new Exception('Error en la eliminación de datos');
            }
        } catch (Exception $e) {
            // echo json_encode(array('ERROR' => $e->getMessage()));
            http_response_code(400); // 400 para errores del usuario, 500 si es error del servidor
            echo json_encode([
                'error' => true,
                'message' => $e->getMessage()
            ]);
            exit;
        }
    }
}
?>