<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ ."/../..//config/cors.php";
include_once __DIR__ . "/baseModelo.php";

class Rol extends BaseModelo
{
    // private function ejecutarSP($query, $params = []) {
    //     $conexion = new conexion();
    //     $sql = $conexion->test()->prepare($query);

    //     if (!empty($params)) {
    //         $sql->bind_param(...$params);
    //     }

    //     $sql->execute();
    //     $result = $sql->get_result();
    //     $sql->close();

    //     return $result;
    // }

    // private function responderJson($respuesta)  {
    //     header('Content-Type: application/json; charset=utf-8');
    //     echo json_encode($respuesta);
    //     exit;
    // }

    public function listarRol() {
        try {
            // Llamada al SP
            // $sql = $conexion->test()->prepare("CALL sp_rol('listar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sistema@uniminuto.edu')");
            $result = $this->ejecutarSP("CALL sp_rol('listar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jeyson.triana.m@uniminuto.edu')");

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
            $result = $this->ejecutarSP("CALL sp_rol('listar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jeyson.triana.m@uniminuto.edu')",
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
                "CALL sp_rol('actualizar', ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 'jeyson.triana.m@uniminuto.edu')",
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
                    'status' => $respuesta['status'] ?? null,
                    'message' => $respuesta['message']  ?? 'Rol actualizado correctamente'
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

?>
