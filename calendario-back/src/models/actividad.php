<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";

class Actividad
{
    // Método para ejecutar el SP
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

    // Método para responder JSON
    private function responderJson($respuesta)
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($respuesta);
        exit;
    }

    public function listarActividad ()
    {
        try {
            $result = $this->ejecutarSp("CALL sp_actividad('listar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
            $actividades = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            $this->responderJson([
                'status' => 1,
                'message' => 'Actividades listadas correctamente',
                'data' => $actividades
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar actividades: ' . $e->getMessage()
            ]);
        }
    }

    public function buscarActividad($id)
    {
        try {
            $result = $this->ejecutarSp("CALL sp_actividad('listar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)",
            ["i", $id]);
            $actividad = $result->fetch_assoc();
            $result->close();

            if ($actividad) {
                $this->responderJson([
                    'status' => 1,
                    'message' => 'Actividad encontrada',
                    'data' => $actividad
                ]);
            } else {
                $this->responderJson([
                    'status' => 0,
                    'message' => 'Actividad no encontrada'
                ]);
            }
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al buscar actividad: ' . $e->getMessage()
            ]);
        }
    }

    public function insertarActividad($dato)
    {
        if (!isset($dato['id_calendario'], $dato['id_padre'], $dato['titulo'], $dato['estado'], $dato['fecha_inicio'], $dato['fecha_fin'], $dato['correo'])) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Faltan datos requeridos para insertar actividad'
            ]);
        }
        try {
            $result = $this->ejecutarSp("CALL sp_actividad('insertar', NULL, ?, ?, ?, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                params: ["iisiss", $dato['id_calendario'], $dato['id_padre'], $dato['titulo'], $dato['estado'], $dato['fecha_inicio'], $dato['fecha_fin']]);

                // Capturar respuesta del SP
                $respuesta = $result->fetch_assoc();
                $this->responderJson($respuesta);

        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al insertar actividad: ' . $e->getMessage()
            ]);
        }
    }

    public function actualizarActividad($id, $dato)
    {
        try {
            $result = $this->ejecutarSp("CALL sp_actividad('actualizar', ?, ?, ?, ?, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                params: ["iiisiss", $id, $dato['id_calendario'], $dato['id_padre'], $dato['titulo'], $dato['estado'], $dato['fecha_inicio'], $dato['fecha_fin']]);

            // Capturar respuesta del SP
            $respuesta = $result->fetch_assoc();
            $this->responderJson($respuesta);

        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al actualizar actividad: ' . $e->getMessage()
            ]);
        }
    }

    public function desactivarActividad($id)
    {
        try {
            $result = $this->ejecutarSp("CALL sp_actividad('deshabilitar', ?, NULL, NULL, NULL, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
                ["i", $id]);

            // Capturar respuesta del SP
            $respuesta = $result->fetch_assoc();
            $this->responderJson($respuesta);

        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al deshabilitar actividad: ' . $e->getMessage()
            ]);
        }
    }

    public function eliminarActividad($id)
    {
        try {
            $result = $this->ejecutarSp("CALL sp_actividad('eliminar', ?, NULL, NULL, NULL, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
                ["i", $id]);

            // Capturar respuesta del SP
            $respuesta = $result->fetch_assoc();
            $this->responderJson($respuesta);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al eliminar actividad: ' . $e->getMessage()
            ]);
        }
    }
}