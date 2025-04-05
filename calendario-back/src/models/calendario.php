<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";

class Calendario
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

    public function listarCalendario()
    {
        try {
            $resulListarCalendario = $this->ejecutarSp("CALL sp_calendario('listar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
            $calendarios = $resulListarCalendario->fetch_all(MYSQLI_ASSOC);
            $resulListarCalendario->close();

            $this->responderJson([
                'sattus' => 1,
                'mssage' => 'Calendarios listados correctamente',
                'data' => $calendarios
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar calendarios: ' . $e->getMessage()
            ]);
        }
    }

    public function buscarCalendario($id)
    {
        try {
            $resultBuscarCalendario = $this->ejecutarSp("CALL sp_calendario('listar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)",
                ["i", $id]);
                $calendario = $resultBuscarCalendario->fetch_assoc();
                $resultBuscarCalendario->close();

                if ($calendario) {
                    $this->responderJson([
                        'status' => 1,
                        'message' => 'Calendario encontrado correctamente',
                        'data' => $calendario
                    ]);
                } else {
                    $this->responderJson([
                        'status' => 0,
                        'message' => 'Calendario no encontrado'
                    ]);
                }
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al buscar calendario: ' . $e->getMessage()
            ]);
        }
    }

    

}
