<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";

class Subactividad 
{

    // Método para ejecutar el SP
    private function ejecutarSP($query, $params = [])
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

    // Método para responder JSON
    private function responderJson($respuesta)
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($respuesta);
        exit;
    }

    public function listarSubactividad()
    {
        try {
            $result = $this->ejecutarSP("CALL sp_subactividad('listar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
            $subactividades = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            $this->responderJson([
                'status' => 1,
                'message' => 'Subactividades listadas correctamente',
                'data' => $subactividades
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar Sub-actividades: ' . $e->getMessage()
            ]);
        }
    }

    public function buscarSubactividad($id)
    {
        try {
            $resultBuscarSubactividad = $this->ejecutarSP("CALL sp_subactividad('listar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)",
                ["i", $id]);
            $subactividad = $resultBuscarSubactividad->fetch_assoc();
            $resultBuscarSubactividad->close();

            if ($subactividad) {
                $this->responderJson([
                    'satus' => 1,
                    'message' => 'Subactividad encontrada',
                    'data' => $subactividad
                ]);
            } else {
                $this->responderJson([
                    'status' => 0,
                    'message' => 'Subactividad no encontrada'
                ]);
            }
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al buscar subactividad: ' . $e->getMessage()
            ]);
        }
    }

    public function insertarSubactividad($dato)
    {
        try {

            if (!isset($dato['id_actividad'], $dato['nombre'], $dato['estado'], $dato['fechaInicio'], $dato['fechaFin'], $dato['id_usuario'])) {
                $this->responderJson([
                    'status' => 0,
                    'message' => 'Faltan datos requeridos para insertar la subactividad'
                ]);
            }

            $resultInsertSub = $this->ejecutarSP("CALL sp_subactividad('insertar', NULL, ?, ?, ?, ?, ?, ?, NULL)", [
                "isssss",
                $dato['id_actividad'],
                $dato['nombre'],
                $dato['estado'],
                $dato['fechaInicio'],
                $dato['fechaFin'],
                $dato['id_usuario']
            ]);

                // Capturar respuesta del SP
                $respuesta = $resultInsertSub->fetch_assoc();
                $this->responderJson($respuesta);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al insertar subactividad: ' . $e->getMessage()
            ]);
        }
    }

    public function actualizarSubactividad($id, $dato)
    {
        try {
            $resultUpdateSub = $this->ejecutarSP("CALL sp_subactividad('actualizar', ?, ?, ?, ?, ?, ?, ?, 1)",
                [
                    "isssssi",
                    $id,
                    $dato['id_actividad'],
                    $dato['nombre'],
                    $dato['estado'],
                    $dato['fechaInicio'],
                    $dato['fechaFin'],
                    $dato['id_usuario']
                ]);

            // Capturar respuesta del SP
            $respuesta = $resultUpdateSub->fetch_assoc();
            $this->responderJson($respuesta);

        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al actualizar subactividad: ' . $e->getMessage()
            ]);
        }
    }

    public function desactivarSubactividad($id)
    {
        try {
            $desactivarSubactividad = $this->ejecutarSP("CALL sp_subactividad('deshabilitar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)",
                ["i", $id]);

            // Capturar respuesta del SP
            $respuesta = $desactivarSubactividad->fetch_assoc();
            $this->responderJson($respuesta);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al desactivar subactividad: ' . $e->getMessage()
            ]);
        }
    }

    public function eliminarSubactividad($id)
    {
        try {
            $eliminarSubactividad = $this->ejecutarSP("CALL sp_subactividad('eliminar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)",
                ["i", $id]);

            // Capturar respuesta del SP
            $respuesta = $eliminarSubactividad->fetch_assoc();
            $this->responderJson($respuesta);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al eliminar subactividad: ' . $e->getMessage()
            ]);
        }
    }
}

?>