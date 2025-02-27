<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once __DIR__ . "/../../config/conexion.php";

class crudSede {
    private $conn;

    public function __construct() {
        $database = new conexion();
        $this->conn = $database->conexion;
    }

    public function listarSedes() {
        try {
            $sql = $this->conn->prepare("SELECT id, codigo, nombre, id_rectoria FROM sede");
            $sql->execute();
            $result = $sql->get_result();

            $sedes = array();
            while ($row = $result->fetch_assoc()) {
                $sedes[] = $row;
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($sedes);
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function consultarSede($id) {
        try {
            $sql = $this->conn->prepare("SELECT id, codigo, nombre, id_rectoria FROM sede WHERE id = ?");
            $sql->bind_param("i", $id);
            $sql->execute();

            $result = $sql->get_result();
            $sede = $result->fetch_assoc();

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($sede);
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function listarSedesPorRectoria($id_rectoria) {
        try {
            $sql = $this->conn->prepare("SELECT id, codigo, nombre FROM sede WHERE id_rectoria = ? ");
            $sql->bind_param("i", $id_rectoria);
            $sql->execute();

            $result = $sql->get_result();
            $sedes = array();
            while ($row = $result->fetch_assoc()) {
                $sedes[] = $row;
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($sedes);
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }
}
?>