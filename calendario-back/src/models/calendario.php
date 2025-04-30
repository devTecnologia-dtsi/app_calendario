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
            $actividades = $this->ejecutarSp("CALL sp_actividad('listar_por_calendario', NULL, ?, NULL, NULL, NULL)",
            ["i", $id]);
            $actividadesArray = [];
    
            while ($actividad = $actividades->fetch_assoc()) {
                // Consultar subactividades por cada actividad
                $subactividades = $this->ejecutarSp("CALL sp_subactividad('listar_por_actividad', NULL, ?, NULL, NULL, NULL, NULL, NULL, NULL)",
                ["i", $actividad['id']]);
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
        if (
            empty($data['id_usuario']) || 
            empty($data['id_rectoria']) || 
            empty($data['id_sede']) || 
            empty($data['id_tipo_calendario']) || 
            empty($data['id_modalidad']) || 
            empty($data['id_periodo_academico']) || 
            empty($data['id_tipo_periodo']) || 
            !isset($data['estado'])
        ) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Faltan datos requeridos para crear el calendario'
            ]);
            return;
        }
    
        try {
            // Crear calendario base
            $resultado = $this->ejecutarSp(
                "CALL sp_calendario('insertar', NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                [
                    'iiiiiiiii',
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
            $res = $resultado->fetch_assoc();
            $idCalendario = $res['id_calendario'];
            $resultado->close();
    
            // Crear actividades
            if (isset($data['actividades']) && is_array($data['actividades'])) {
                foreach ($data['actividades'] as $actividad) {
                    $resActividad = $this->ejecutarSp(
                        "CALL sp_actividad('insertar', NULL, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                        [
                            'iss',
                            $idCalendario,
                            $actividad['titulo'],
                            $actividad['estado']
                        ]
                    );
                    $actividadCreada = $resActividad->fetch_assoc();
                    $idActividad = $actividadCreada['id_actividad'];
                    $resActividad->close();
    
                    // Crear subactividades
                    if (isset($actividad['subactividades']) && is_array($actividad['subactividades'])) {
                        foreach ($actividad['subactividades'] as $subactividad) {
                            $this->ejecutarSp(
                                "CALL sp_subactividad('insertar', NULL, ?, ?, ?, ?, ?, ?, 'jeyson.triana.m@uniminuto.edu')",
                                [
                                    'ississ',
                                    $idActividad,
                                    $subactividad['nombre'],
                                    $subactividad['descripcion'],
                                    $subactividad['estado'],
                                    $subactividad['fecha_inicio'],
                                    $subactividad['fecha_fin']
                                ]
                            )->close();
                        }
                    }
                }
            }
    
            $this->responderJson([
                'status' => 1,
                'message' => 'Calendario creado exitosamente',
                'id_calendario' => $idCalendario
            ]);
    
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al crear calendario completo: ' . $e->getMessage()
            ]);
        }
    }
 
    public function actualizarCalendarioCompleto($id, $data)
    {
        if (
            empty($data['id_usuario']) || 
            empty($data['id_rectoria']) || 
            empty($data['id_sede']) || 
            empty($data['id_tipo_calendario']) || 
            empty($data['id_modalidad']) || 
            empty($data['id_periodo_academico']) || 
            !isset($data['estado'])
        ) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Faltan datos requeridos para actualizar el calendario'
            ]);
            return;
        }
    
        try {
            // 1. Actualizar calendario
            $this->ejecutarSp(
                "CALL sp_calendario('actualizar', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                [
                    'iiiiiiiiii',
                    $id,
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
            )->close();
    
            // 2. Procesar actividades
            if (isset($data['actividades']) && is_array($data['actividades'])) {
                foreach ($data['actividades'] as $actividad) {
    
                    if (isset($actividad['id']) && $actividad['id'] > 0) {
                        // Actualizar actividad
                        $this->ejecutarSp(
                            "CALL sp_actividad('actualizar', ?, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                            [
                                'iisi',
                                $actividad['id'],
                                $id,
                                $actividad['titulo'],
                                $actividad['estado']
                                // 'jeyson.triana@uniminuto.edu'
                            ]
                        )->close();
                        $idActividad = $actividad['id'];
                    } else {
                        // Insertar nueva actividad
                        $resAct = $this->ejecutarSp(
                            "CALL sp_actividad('insertar', NULL, ?, ?, ?, 'jeyson.triana@uniminuto.edu')",
                            [
                                'iss',
                                $id,
                                $actividad['titulo'],
                                $actividad['estado']
                            ]
                        );
                        $actividadInsertada = $resAct->fetch_assoc();
                        $idActividad = $actividadInsertada['id_actividad'];
                        $resAct->close();
                    }
    
                    // 3. Procesar subactividades
                    if (isset($actividad['subactividades']) && is_array($actividad['subactividades'])) {
                        foreach ($actividad['subactividades'] as $subactividad) {
    
                            if (isset($subactividad['id']) && $subactividad['id'] > 0) {
                                // Actualizar subactividad
                                $this->ejecutarSp(
                                    "CALL sp_subactividad('actualizar', ?, ?, ?, ?, ?, ?, ?, 'jeyson.triana.m@uniminuto.edu')",
                                    [
                                        'iississ',
                                        $subactividad['id'],
                                        $idActividad,
                                        $subactividad['nombre'],
                                        $subactividad['descripcion'],
                                        $subactividad['estado'],
                                        $subactividad['fecha_inicio'],
                                        $subactividad['fecha_fin']
                                    ]
                                )->close();
                            } else {
                                // Insertar nueva subactividad
                                $this->ejecutarSp(
                                    "CALL sp_subactividad('insertar', NULL, ?, ?, ?, ?, ?, ?, 'jeyson.triana.m@uniminuto.edu')",
                                    [
                                        'ississ',
                                        $idActividad,
                                        $subactividad['nombre'],
                                        $subactividad['descripcion'],
                                        $subactividad['estado'],
                                        $subactividad['fecha_inicio'],
                                        $subactividad['fecha_fin']
                                    ]
                                )->close();
                            }
                        }
                    }
                }
            }
    
            $this->responderJson([
                'status' => 1,
                'message' => 'Calendario actualizado exitosamente.'
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al actualizar calendario completo: ' . $e->getMessage()
            ]);
        }
    }
    
    public function deshabilitarCalendario($id)
    {
        try {
            $resultDesactivarCalendario = $this->ejecutarSp("CALL sp_calendario('deshabilitar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jeyson.triana@uniminuto.edu')",
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
