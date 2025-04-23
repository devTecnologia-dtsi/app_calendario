<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";
include_once __DIR__ ."/baseModelo.php";


class Actividad extends BaseModelo
{

    public function listarActividad ()
    {
        try {
            $result = $this->ejecutarSp("CALL sp_actividad('listar', NULL, NULL, NULL, NULL, NULL)");
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
            $result = $this->ejecutarSp("CALL sp_actividad('listar', ?, NULL, NULL, NULL, NULL)",
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
        if (!isset($dato['id_calendario'], $dato['titulo'], $dato['estado'])) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Faltan datos requeridos para insertar actividad'
            ]);
        }
        try {
            $result = $this->ejecutarSp(
                "CALL sp_actividad('insertar', NULL, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                ["iss", 
                    $dato['id_calendario'], 
                    $dato['titulo'], 
                    $dato['estado']
                ]
            );

            // Capturar respuesta SP
            $respuesta = $result->fetch_assoc();
            $result->close();

            $this->responderJson([
                'status' => 1,
                'message' => 'Actividad insertada correctamente',
                'data' => $respuesta
            ]);

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
            $result = $this->ejecutarSp("CALL sp_actividad('actualizar', ?, ?, ?, ?, 'jeyson.triana@uniminuto.edu')", 
            ["iisis", $id, $dato['id_calendario'], $dato['titulo'], $dato['estado'], $dato['correo']]);
        
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
            $result = $this->ejecutarSp("CALL sp_actividad('deshabilitar', ?, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
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
            $result = $this->ejecutarSp("CALL sp_actividad('eliminar', ?, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
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