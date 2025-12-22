<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";
include_once __DIR__ . "/baseModelo.php";

class Sede extends BaseModelo
{

    public function listarSedes()
    {
        try {
            $datos = $this->obtenerDatosDesdeToken();
            $idUsuario = $datos->id ?? null;

            if (!$idUsuario) {
                throw new Exception("No se pudo obtener el ID del usuario desde el token.");
            }
            $result = $this->ejecutarSP("CALL sp_sede('listar', NULL, NULL)");
            $sedes = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            // Modificar el estado antes de enviarlo al frontend
            foreach ($sedes as &$sede) {
                $sede['estado'] = ($sede['estado'] == 0) ? 'Sede deshabilitada' : 'Activa';
            }

            $this->responderJson([
                'status' => 1,
                'message' => 'Sedes listadas correctamente',
                'data' => $sedes
            ]);
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar sedes: ' . $e->getMessage()
            ]);
        }
    }

    public function consultarSede($id)
    {
        try {
            $datos = $this->obtenerDatosDesdeToken();
            $idUsuario = $datos->id ?? null;

            if (!$idUsuario) {
                throw new Exception("No se pudo obtener el ID del usuario desde el token.");
            }
            $result = $this->ejecutarSP(
                "CALL sp_sede('listar', ?, NULL)",
                ["i", $id]
            );
            $sede = $result->fetch_assoc();
            $result->close();

            if ($sede) {
                $sede['estado'] = ($sede['estado'] == 0) ? 'Sede deshabilitada' : 'Activa';

                $this->responderJson([
                    'status' => 1,
                    'message' => 'Sede consultada correctamente',
                    'data' => $sede
                ]);
            } else {
                $this->responderJson([
                    'status' => 0,
                    'message' => 'Sede no encontrada'
                ]);
            }
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al consultar sede: ' . $e->getMessage()
            ]);
        }
    }

    public function listarSedesPorRectoria($idRectoria)
    {
        try {
            $datos = $this->obtenerDatosDesdeToken();
            $idUsuario = $datos->id ?? null;

            if (!$idUsuario) {
                throw new Exception("No se pudo obtener el ID del usuario desde el token.");
            }
            // Verificar que el parámetro $idRectoria no sea nulo
            if ($idRectoria === null) {
                throw new Exception("El ID de la rectoría es obligatorio.");
            }

            // Llamar al procedimiento almacenado con el parámetro $idRectoria
            $result = $this->ejecutarSP(
                "CALL sp_sede('listar_por_rectoria', NULL, ?)",
                ["i", $idRectoria]
            );
            $sedes = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            // Responder con los datos obtenidos
            $this->responderJson([
                'status' => 1,
                'message' => 'Sedes listadas por rectoría correctamente',
                'data' => $sedes
            ]);
        } catch (Exception $e) {
            // Manejar errores y responder con un mensaje de error
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar sedes por rectoría: ' . $e->getMessage()
            ]);
        }
    }

    public function listarSedesPorUsuario()
    {
        try {
            // Obtener datos desde el token JWT
            $datos = $this->obtenerDatosDesdeToken();
            $idUsuario = $datos->id ?? null;

            if (!$idUsuario) {
                throw new Exception("No se pudo obtener el ID del usuario desde el token.");
            }

            // Llamar al procedimiento almacenado (sin rectoría)
            $sql = "CALL sp_usuario_sedes('listar', ?)";
            $result = $this->ejecutarSP($sql, ["i", $idUsuario]);

            // Obtener los resultados
            $sedes = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            // Enviar la respuesta JSON
            $this->responderJson([
                'status' => 1,
                'message' => 'Sedes listadas correctamente',
                'data' => $sedes
            ]);
        } catch (Exception $e) {
            //  Manejo de errores
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar sedes por usuario: ' . $e->getMessage()
            ]);
        }
    }
}
