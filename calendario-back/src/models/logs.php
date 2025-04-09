<?php 

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";

class Logs
{
    private function ejecutarSp($query, $params = [])
    {
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

    private function responderJson($respuesta)
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($respuesta);
        exit;
    }

    public function listarLogs()
    {
        try{
            $resultListarLogs = $this->ejecutarSp("CALL sp_logs('listar', NULL, NULL, NULL, NULL, NULL)");
            $logs = $resultListarLogs->fetch_all(MYSQLI_ASSOC);
            $resultListarLogs->close();

            $this->responderJson([
                'status' => 1,
                'message' => 'Logs listados correctamente',
                'data' => $logs
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar logs: ' . $e->getMessage()
            ]);
        }
    }

    public function buscarLogs($id)
    {
        try {
            $resultBuscarLogs = $this->ejecutarSp("CALL sp_logs('listar', ?, NULL, NULL, NULL, NULL)",
                ["i", $id]);
            $log = $resultBuscarLogs->fetch_assoc();
            $resultBuscarLogs->close();

            if ($log) {
                $this->responderJson([
                    'status' => 1,
                    'message' => 'Log encontrado correctamente',
                    'data' => $log
                ]);
            } else {
                $this->responderJson([
                    'status' => 0,
                    'message' => 'Log no encontrado'
                ]);
            }
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al buscar log: ' . $e->getMessage()
            ]);
        }
    }
}

?>