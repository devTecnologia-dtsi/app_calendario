<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";

class Sede {

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

    private function responderJson($respuesta) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($respuesta);
        exit;
    }

    public function listarSedes() {
        try {
            $result = $this->ejecutarSP("CALL sp_sede('listar', NULL, NULL, NULL)");
            $sedes = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            $this->responderJson([
                'status' => 1,
                'message' => 'Sedes listadas correctamente',
                'data' => $sedes
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar sedes: ' . $e->getMessage()
            ]);
        }
    }

    public function consultarSede($id) {
        try {
            $result = $this->ejecutarSP("CALL sp_sede('obtener', ?, NULL, NULL)", ["i", $id]);
            $sede = $result->fetch_assoc();
            $result->close();

            if ($sede) {
                $this->responderJson([
                    'status' => 1,
                    'message' => 'Sede consultada correctamente',
                    'data' => $sede
                ]);
            } else {
                $this->responderJson([
                    'status' => 0,
                    'message' => 'Sede no encontrada'
                ]);
            }
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al consultar sede: ' . $e->getMessage()
            ]);
        }
    }

    public function listarSedesPorRectoria($idRectoria) {
        try {
            $result = $this->ejecutarSP("CALL sp_sede('listar_por_rectoria', NULL, ?, NULL)", ["i", $idRectoria]);
            $sedes = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            $this->responderJson([
                'status' => 1,
                'message' => 'Sedes listadas por rectoría correctamente',
                'data' => $sedes
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar sedes por rectoría: ' . $e->getMessage()
            ]);
        }
    }
}

// include_once __DIR__ . "/../../config/conexion.php";
// include_once __DIR__ . "/../../config/cors.php";

// class crudSede {
//     private $conn;

//     public function __construct() {
//         $database = new conexion();
//         $this->conn = $database->conexion;
//     }

//     public function listarSedes() {
//         try {
//             $sql = $this->conn->prepare("SELECT id, codigo, nombre, id_rectoria FROM sede");
//             $sql->execute();
//             $result = $sql->get_result();

//             $sedes = array();
//             while ($row = $result->fetch_assoc()) {
//                 $sedes[] = $row;
//             }

//             header('Content-Type: application/json; charset=utf-8');
//             echo json_encode($sedes);
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }

//     public function consultarSede($id) {
//         try {
//             $sql = $this->conn->prepare("SELECT id, codigo, nombre, id_rectoria FROM sede WHERE id = ?");
//             $sql->bind_param("i", $id);
//             $sql->execute();

//             $result = $sql->get_result();
//             $sede = $result->fetch_assoc();

//             header('Content-Type: application/json; charset=utf-8');
//             echo json_encode($sede);
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }

//     public function listarSedesPorRectoria($id_rectoria) {
//         try {
//             $sql = $this->conn->prepare("SELECT id, codigo, nombre FROM sede WHERE id_rectoria = ? ");
//             $sql->bind_param("i", $id_rectoria);
//             $sql->execute();

//             $result = $sql->get_result();
//             $sedes = array();
//             while ($row = $result->fetch_assoc()) {
//                 $sedes[] = $row;
//             }

//             header('Content-Type: application/json; charset=utf-8');
//             echo json_encode($sedes);
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }
// }
?>