<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once __DIR__ . "/../../config/conexion.php";

class crudRectoria
{
    private $conn;

    public function __construct() {
        $database = new conexion();
        $this->conn = $database->conexion; 
    }

    public function listarRectorias() {
        try {
            $sql = $this->conn->prepare("SELECT id, codigo, nombre FROM rectoria WHERE estado = 1");
            $sql->execute();
            $result = $sql->get_result();

            $rectorias = array();
            while ($row = $result->fetch_assoc()) {
                $rectorias[] = $row;
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($rectorias);
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function consultarRectoria($id) {
        try {
            $sql = $this->conn->prepare("SELECT id, codigo, nombre FROM rectoria WHERE id = ? AND estado = 1");
            $sql->bind_param("i", $id);
            $sql->execute();

            $result = $sql->get_result();
            $rectoria = $result->fetch_assoc();

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($rectoria);
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }
}
?>