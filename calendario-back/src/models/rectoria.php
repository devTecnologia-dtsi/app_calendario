<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";
include_once __DIR__ . "/baseModelo.php";


class Rectoria extends BaseModelo
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

    // private function responderJson($respuesta) {
    //     header('Content-Type: application/json; charset=utf-8');
    //     echo json_encode($respuesta);
    //     exit;
    // }

    public function listarRectorias() {
        try {
            $result = $this->ejecutarSP("CALL sp_rectoria('listar', NULL)");
            $rectorias = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            $this->responderJson([
                'status' => 1,
                'message' => 'Rectorías listadas correctamente',
                'data' => $rectorias
            ]);

        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar rectorías: ' . $e->getMessage()
            ]);
        }
    }
    
    public function consultarRectoria($id) {
        try {
            $result = $this->ejecutarSP("CALL sp_rectoria('listar', ?)", 
                ["i", $id]);
            $rectoria = $result->fetch_assoc();
            $result->close();

            if ($rectoria) {
                $this->responderJson([
                    'status' => 1,
                    'message' => 'Rectoría consultada correctamente',
                    'data' => $rectoria
                ]);
            } else {
                $this->responderJson([
                    'status' => 0,
                    'message' => 'Rectoría no encontrada'
                ]);
            }
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al consultar rectoría: ' . $e->getMessage()
            ]);
        }
    }
}

?>