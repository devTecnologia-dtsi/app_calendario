<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";

class Rectoria
{
    private function ejecutarSP($query, $params = []) {
        $conexion = new conexion();
        $sql = $conexion->test()->prepare($query);

        if (!empty($params)) {
            $sql->execute();
        }

        $sql->execute();
        $result = $sql->get_result();
        $sql->close();

        return $result;
    }

    // private function ejecutarSP($query, $params = []) {
    //     $conexion = new conexion();
    //     $sql = $conexion->test()->prepare($query);
    
    //     if (!empty($params)) {
    //         // Separar los tipos de parámetros
    //         $types = array_shift($params);
    
    //         // Crear un array de referencias
    //         $refs = [];
    //         foreach ($params as $key => $value) {
    //             $refs[$key] = &$params[$key];
    //         }
    
    //         // Pasar tipos y referencias a bind_param()
    //         $sql->bind_param($types, ...$refs);
    //     }
    
    //     $sql->execute();
    //     $result = $sql->get_result();
    //     $sql->close();
    
    //     return $result;
    // }
    
    private function responderJson($respuesta) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($respuesta);
        exit;
    }

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
            $result = $this->ejecutarSP("CALL sp_rectoria('obtener', ?)", ["i", $id]);
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

// class Rectoria
// {
//     private $conn;

//     public function __construct() {
//         $database = new conexion();
//         $this->conn = $database->conexion; 
//     }

//     public function listarRectorias() {
//         try {
//             $sql = $this->conn->prepare("SELECT id, codigo, nombre FROM rectoria WHERE estado = 1");
//             $sql->execute();
//             $result = $sql->get_result();

//             $rectorias = array();
//             while ($row = $result->fetch_assoc()) {
//                 $rectorias[] = $row;
//             }

//             header('Content-Type: application/json; charset=utf-8');
//             echo json_encode($rectorias);
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }

//     public function consultarRectoria($id) {
//         try {
//             $sql = $this->conn->prepare("SELECT id, codigo, nombre FROM rectoria WHERE id = ? AND estado = 1");
//             $sql->bind_param("i", $id);
//             $sql->execute();

//             $result = $sql->get_result();
//             $rectoria = $result->fetch_assoc();

//             header('Content-Type: application/json; charset=utf-8');
//             echo json_encode($rectoria);
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }
// }
?>