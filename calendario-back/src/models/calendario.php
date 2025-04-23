<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";
include_once __DIR__ ."/baseModelo.php";


class Calendario extends BaseModelo
{

    public function listarCalendario()
    {
        try {
            $resulListarCalendario = $this->ejecutarSp("CALL sp_calendario('listar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
            $calendarios = $resulListarCalendario->fetch_all(MYSQLI_ASSOC);
            $resulListarCalendario->close();

            $this->responderJson([
                'sattus' => 1,
                'message' => 'Calendarios listados correctamente',
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
            $resultBuscarCalendario = $this->ejecutarSp("CALL sp_calendario('listar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)",
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

    public function insertarCalendario($data)
    {
        // // Validar que los datos requeridos estén presentes
        // if (!isset($data['id_usuario']) || !isset($data['id_rectoria']) || !isset($data['id_sede']) ||
        // !isset($data['id_tipo_calendario']) || !isset($data['id_modalidad']) || !isset($data['id_tipo_periodo']) ||
        // !isset($data['estado']) || !isset($data['en_sede'])) {
        // $this->responderJson([
        //     'status' => 0,
        //     'message' => 'Faltan datos requeridos para insertar el calendario'
        // ]);
        // return;
        // }
    
        try {
            $resultInsertarCalendario = $this->ejecutarSp(
                "CALL sp_calendario('insertar', NULL, ?, ?, ?, ?, ?, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                [
                    "iiiiiiiii", 
                    $data['id_usuario'], 
                    $data['id_rectoria'],
                    $data['id_sede'],
                    $data['id_tipo_calendario'],
                    $data['id_modalidad'],
                    $data['id_periodo_academico'],
                    $data['id_tipo_periodo'],
                    $data['estado'],
                    $data['en_sede']
                ]
            );
            
            // Respuesta del SP
            $respuesta = $resultInsertarCalendario->fetch_assoc();
            $this->responderJson([
                'status' => 1,
                'message' => 'Calendario creado correctamente.',
                'data' => $respuesta
            ]);

        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al insertar calendario: ' . $e->getMessage()
            ]);
        }
    }
    

    public function actualizarCalendario($id, $data)
    {
        // Depuración: Verificar el contenido de $data
        // var_dump($data);
        // exit;

        // Validar que los datos requeridos estén presentes
        if (
            empty($data['id_usuario']) || 
            empty($data['id_rectoria']) || 
            empty($data['id_sede']) || 
            empty($data['id_tipo_calendario']) || 
            empty($data['id_modalidad']) || 
            empty($data['id_periodo']) || 
            !isset($data['estado'])
        ) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Faltan datos requeridos para actualizar el calendario'
            ]);
            return;
        }
        try {

            // Ejecutar SP
            $result = $this->ejecutarSp(
                "CALL sp_calendario('actualizar', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                [
                    'iiiiiiiii',
                    $id,
                    $data['id_usuario'], 
                    $data['id_rectoria'],
                    $data['id_sede'],
                    $data['id_tipo_calendario'],
                    $data['id_modalidad'],
                    $data['id_periodo'],
                    $data['id_tipo_periodo'],
                    $data['estado'],
                    $data['en_sede']

                ]
            );
    
            // Capturar respuesta del SP
            $respuesta = $result->fetch_assoc();
            $this->responderJSON($respuesta);
    
        } catch (Exception $e) {
            http_response_code(400);
            $this->responderJSON([
                'error' => true,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function deshabilitarCalendario($id)
    {
        try {
            $resultDesactivarCalendario = $this->ejecutarSp("CALL sp_calendario('deshabilitar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
                ["i", $id]);
            
            $respuesta = $resultDesactivarCalendario->fetch_assoc();
            $this->responderJson($respuesta);

        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al deshabilitar calendario: ' . $e->getMessage()
            ]);
        }
    }

    // No se usa, pero se deja funcional en caso de implementación
    public function eliminarCalendario($id)
    {
        try {
            $respuestaEliminarCalendario = $this->ejecutarSp("CALL sp_calendario('eliminar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
                ["i", $id]);

                // Capturar respuesta del SP
            $respuesta = $respuestaEliminarCalendario->fetch_assoc();
            $this->responderJson($respuesta);

        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al eliminar calendario: ' . $e->getMessage()
            ]);
        }
    }



}
