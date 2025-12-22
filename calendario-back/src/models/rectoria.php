<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";
include_once __DIR__ . "/baseModelo.php";


class Rectoria extends BaseModelo
{
    public function listarRectorias()
    {
        try {
            $datos = $this->obtenerDatosDesdeToken();
            $idUsuario = $datos->id ?? null;

            if (!$idUsuario) {
                throw new Exception("No se pudo obtener el ID del usuario desde el token.");
            }
            $result = $this->ejecutarSP("CALL sp_rectoria('listar', NULL)");
            $rectorias = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            $this->responderJson([
                'status' => 1,
                'message' => 'Rectorías listadas correctamente',
                'data' => $rectorias
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar rectorías: ' . $e->getMessage()
            ]);
        }
    }

    public function listarRectoriasPorUsuario($rol = null)
    {
        try {
            $datos = $this->obtenerDatosDesdeToken();
            $permisos = $datos->permisos ?? [];

            if (empty($permisos)) {
                throw new Exception("El usuario no tiene permisos asociados.");
            }

            if ($rol) {
                $rol = strtolower($rol);
                $permisos = array_filter($permisos, function ($p) use ($rol) {
                    return strpos(strtolower($p->nombre_rol), $rol) !== false;
                });
            }

            $rectoriasUnicas = [];
            foreach ($permisos as $permiso) {
                $id = $permiso->id_rectoria;
                if (!isset($rectoriasUnicas[$id])) {
                    $rectoriasUnicas[$id] = [
                        'id_rectoria' => $permiso->id_rectoria,
                        'nombre_rectoria' => $permiso->nombre_rectoria
                    ];
                }
            }

            $this->responderJson([
                'status' => 1,
                'message' => 'Rectorías filtradas correctamente',
                'data' => array_values($rectoriasUnicas)
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar rectorías por usuario: ' . $e->getMessage()
            ]);
        }
    }

    public function consultarRectoria($id)
    {
        try {
            $datos = $this->obtenerDatosDesdeToken();
            $idUsuario = $datos->id ?? null;

            if (!$idUsuario) {
                throw new Exception("No se pudo obtener el ID del usuario desde el token.");
            }
            $result = $this->ejecutarSP(
                "CALL sp_rectoria('listar', ?)",
                ["i", $id]
            );
            $rectoria = $result->fetch_assoc();
            $result->close();

            if ($rectoria) {
                $this->responderJson([
                    'status' => 1,
                    'message' => 'Rectoría consultada correctamente',
                    'data' => $rectoria
                ]);
            } else {
                $this->responderJson([
                    'status' => 0,
                    'message' => 'Rectoría no encontrada'
                ]);
            }
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al consultar rectoría: ' . $e->getMessage()
            ]);
        }
    }
}
