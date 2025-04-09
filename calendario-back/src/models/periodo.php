<?php 

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";

class Periodo
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

    public function listarPeriodos()
    {
        try {
            $result = $this->ejecutarSp("CALL sp_periodo('listar', NULL, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')");
            $periodos = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            $this->responderJson([
                'status' => 1,
                'message' => 'Períodos académicos listados correctamente',
                'data' => $periodos
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar períodos: ' . $e->getMessage()
            ]);
        }
    }

    public function buscarPeriodo($id)
    {
        try {
            $result = $this->ejecutarSp("CALL sp_periodo('listar', ?, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
                ["i", $id]);
            $periodo = $result->fetch_assoc();
            $result->close();

            if ($periodo) {
                $this->responderJson([
                    'status' => 1,
                    'message' => 'Período encontrado',
                    'data' => $periodo
                ]);
            } else {
                $this->responderJson([
                    'status' => 0,
                    'message' => 'Período no encontrado'
                ]);
            }
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al buscar período: ' . $e->getMessage()
            ]);
        }
    }

    public function crearPeriodo($data)
    {
        try {
            $result = $this->ejecutarSp("CALL sp_periodo('insertar', NULL, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                ["iii", $data['anio'], $data['periodo'], $data['estado']]);

            $respuesta = $result->fetch_assoc();
            $this->responderJson($respuesta);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al crear período: ' . $e->getMessage()
            ]);
        }
    }

    public function actualizarPeriodo($id, $data)
    {
        try {
            $result = $this->ejecutarSp("CALL sp_periodo('actualizar', ?, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                ["iiii", $id, $data['anio'], $data['periodo'], $data['estado']]);

            $respuesta = $result->fetch_assoc();
            $this->responderJson($respuesta);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al actualizar período: ' . $e->getMessage()
            ]);
        }
    }

    public function deshabilitarPeriodo($id)
    {
        try {
            $result = $this->ejecutarSp("CALL sp_periodo('deshabilitar', ?, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
                ["i", $id]);

            $respuesta = $result->fetch_assoc();
            $this->responderJson($respuesta);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al deshabilitar período: ' . $e->getMessage()
            ]);
        }
    }

    public function eliminarPeriodo($id)
    {
        try {
            $result = $this->ejecutarSp("CALL sp_periodo('eliminar', ?, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
                ["i", $id]);

            $respuesta = $result->fetch_assoc();
            $this->responderJson($respuesta);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al eliminar período: ' . $e->getMessage()
            ]);
        }
    }
}
