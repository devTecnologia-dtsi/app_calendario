<?php 

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";
include_once __DIR__ . "/baseModelo.php";

class Modalidades extends BaseModelo
{
    // private function ejecutarSp($query, $params = [])
    // {
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

    // private function responderJson($respuesta)
    // {
    //     header('Content-Type: application/json; charset=utf-8');
    //     echo json_encode($respuesta);
    //     exit;
    // }

    public function listarModalidades()
    {
        try {
            $result = $this->ejecutarSp("CALL sp_modalidades('listar', NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')");
            $modalidades = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            $this->responderJson([
                'status' => 1,
                'message' => 'Modalidades listadas correctamente',
                'data' => $modalidades
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar modalidades: ' . $e->getMessage()
            ]);
        }
    }

    public function buscarModalidad($id)
    {
        try {
            $result = $this->ejecutarSp("CALL sp_modalidades('listar', ?, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
                ["i", $id]);
            $modalidad = $result->fetch_assoc();
            $result->close();

            if ($modalidad) {
                $this->responderJson([
                    'status' => 1,
                    'message' => 'Modalidad encontrada',
                    'data' => $modalidad
                ]);
            } else {
                $this->responderJson([
                    'status' => 0,
                    'message' => 'Modalidad no encontrada'
                ]);
            }
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al buscar modalidad: ' . $e->getMessage()
            ]);
        }
    }

    public function crearModalidad($data)
    {
        try {
            $resultCrearModalidad = $this->ejecutarSp("CALL sp_modalidades('insertar', NULL, ?, ?, 'jeyson.triana@uniminuto.edu')",
                ["si",
                $data['nombre'],
                $data['estado']]);
            
            // Capturar respuesta del SP
            $respuesta = $resultCrearModalidad->fetch_assoc();
            $this->responderJson($respuesta);

        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al crear modalidad: ' . $e->getMessage()
            ]);
        }
    }

    public function actualizarModalidad($id, $data)
    {
        try {
            $resultActualizarModalidad = $this->ejecutarSp("CALL sp_modalidades('actualizar', ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                ["isi",
                $id,
                $data['nombre'],
                $data['estado']]);

            // Capturar respuesta del SP
            $respuesta = $resultActualizarModalidad->fetch_assoc();
            $this->responderJson($respuesta);

        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al actualizar modalidad: ' . $e->getMessage()
            ]);
        }
    }

    public function desactivarModalidad($id)
    {
        try {
            $result = $this->ejecutarSp("CALL sp_modalidades('deshabilitar', ?, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
                ["i", $id]);

            // Capturar respuesta del SP
            $respuesta = $result->fetch_assoc();
            $this->responderJson($respuesta);

        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al deshabilitar la modalidad: ' . $e->getMessage()
            ]);
        }
    }

    public function eliminarModalidad($id)
    {
        try {
            $result = $this->ejecutarSp("CALL sp_modalidades('eliminar', ?, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
                ["i", $id]);

            // Capturar respuesta del SP
            $respuesta = $result->fetch_assoc();
            $this->responderJson($respuesta);
            
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al eliminar la modalidad: ' . $e->getMessage()
            ]);
        }
    }
}
?>