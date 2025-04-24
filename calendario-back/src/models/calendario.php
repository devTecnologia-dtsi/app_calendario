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

    public function consultarCalendarioParaEdicion($id)
    {
        try {
            // Consultar el calendario base
            $result = $this->ejecutarSp("CALL sp_calendario('listar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')", ["i", $id]);
            $calendario = $result->fetch_assoc();
            $result->close();
    
            if (!$calendario) {
                return $this->responderJson([
                    'status' => 0,
                    'message' => 'Calendario no encontrado'
                ]);
            }
    
            // Consultar actividades
            $actividades = $this->ejecutarSp("SELECT * FROM actividad WHERE id_calendario = ?", ["i", $id]);
            $actividadesArray = [];
    
            while ($actividad = $actividades->fetch_assoc()) {
                // Consultar subactividades por cada actividad
                $subactividades = $this->ejecutarSp("SELECT * FROM subactividad WHERE id_actividad = ?", ["i", $actividad['id']]);
                $subactividadesArray = [];
    
                while ($sub = $subactividades->fetch_assoc()) {
                    $subactividadesArray[] = $sub;
                }
    
                $actividad['subactividades'] = $subactividadesArray;
                $actividadesArray[] = $actividad;
            }
    
            $calendario['actividades'] = $actividadesArray;
    
            return $this->responderJson([
                'status' => 1,
                'message' => 'Calendario a editar obtenido',
                'data' => $calendario
            ]);
        } catch (Exception $e) {
            return $this->responderJson([
                'status' => 0,
                'message' => 'Error al obtener el calendario: ' . $e->getMessage()
            ]);
        }
    }
    
    
    public function insertarCalendario($data)
    {
    // Validar que los datos requeridos estén presentes
    if (!isset($data['id_usuario']) || !isset($data['id_rectoria']) || !isset($data['id_sede']) ||
        !isset($data['id_tipo_calendario']) || !isset($data['id_modalidad']) || !isset($data['id_tipo_periodo']) ||
        !isset($data['estado']) || !isset($data['en_sede'])) {
        $this->responderJson([
            'status' => 0,
            'message' => 'Faltan datos requeridos para insertar el calendario'
        ]);
        return;
        }

    try {
        $resultInsertarCalendario = $this->ejecutarSp("CALL sp_calendario('insertar', NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
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
            ]);

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

    public function editarCalendario($id) 
    {
        try {
            $resultadoCalendario = $this->ejecutarSp("CALL sp_calendario('listar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
            ["i", $id]);
            $calendario = $resultadoCalendario->fetch_assoc();
            $resultadoCalendario->close();

            if(!$calendario) {
                return $this->responderJson([
                    'status' => 0,
                    'message' => 'Calendario no encontrado'
                ]);
            }

            // Obtener las actividades del calendario
            $resultadoActividades = $this->ejecutarSp("CALL sp_actividad('listar_por_calendario',  ?, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
            ["i", $id]);
            $actividades = [];

            while ($actividad = $resultadoActividades->fetch_assoc()) {
                $idActividad = $actividad['id'];

                // Obtener subactividades para cada actividad
                $resultadoSubactividades = $this->ejecutarSp("CALL sp_subactividad('listar_por_actividad', ?, NULL, NULL, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
                 ["i", $idActividad]);
                $subactividades = $resultadoSubactividades->fetch_all(MYSQLI_ASSOC);
                $resultadoSubactividades->close();

                // Asociar las subactividades a la actividad
                $actividad['subactividades'] = $subactividades;
                $actividades[] = $actividad;

            }
            $resultadoActividades->close();

            // Agregar actividades al calendario
            $calendario['actividades'] = $actividades;

            // Devolver toda la estructura
            $this->responderJson([
                'status' => 1,
                'message' => 'Calendario a editar obtenido',
                'data' => $calendario
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al obtener calendario: ' . $e->getMessage()
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
