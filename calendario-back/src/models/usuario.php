<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";
include_once __DIR__ . "/baseModelo.php";
include_once __DIR__ . "/../seguridad/jwt_utils.php";

class CrudUsuario extends BaseModelo
{
    
    // Listar usuarios con paginación y filtro
    public function listarUsuarios($limite, $offset)
    {
        try {
            $filtro = $_GET['filtro'] ?? '';

            $sql = "CALL sp_usuario_listar(?, ?, ?)";
            $result = $this->ejecutarSP($sql, ['iis', $limite, $offset, $filtro]);
            if (!$result) {
                throw new Exception("Error al ejecutar sp_usuario_listar");
            }

            $usuarios = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            $total = $usuarios[0]['total'] ?? 0;

            $this->responderJson([
                'status' => 1,
                'message' => 'Usuarios listados correctamente',
                'total' => $total,
                'data' => $usuarios
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al listar usuarios: ' . $e->getMessage()
            ]);
        }
    }

    
    // Consultar un usuario por ID
    public function consultarUsuario($id)
    {
        try {
            $sql = "CALL sp_usuario_ver(?)";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bind_param('i', $id);
            $stmt->execute();

            // Primer conjunto: datos del usuario
            $result = $stmt->get_result();
            if (!$result) throw new Exception("Error al obtener usuario");
            $usuario = $result->fetch_assoc();
            $result->close();

            if (!$usuario) throw new Exception("Usuario no encontrado");

            // Segundo conjunto: permisos
            $stmt->next_result();
            $resultPermisos = $stmt->get_result();
            $permisos = $resultPermisos ? $resultPermisos->fetch_all(MYSQLI_ASSOC) : [];
            $resultPermisos?->close();
            $stmt->close();

            $this->responderJson([
                'status' => 1,
                'message' => 'Usuario obtenido correctamente',
                'data' => [
                    'usuario' => $usuario,
                    'permisos' => $permisos
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(404);
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al consultar usuario: ' . $e->getMessage()
            ]);
        }
    }

    
    // Crear usuario + permisos
    public function insertarUsuario($data)
    {
        try {
            $correo = $data['correo'] ?? null;
            $estado = $data['estado'] ?? 1;
            $permisos = $data['permisos'] ?? [];

            if (!$correo || empty($permisos)) {
                throw new Exception("El correo y al menos un permiso son obligatorios");
            }

            // Crear usuario base
            $spUsuario = "CALL sp_usuario_crud('insertar', NULL, ?, ?)";
            $resUsuario = $this->ejecutarSP($spUsuario, ['si', $correo, $estado]);
            $usuario = $resUsuario->fetch_assoc();
            $resUsuario->close();

            if (($usuario['status'] ?? 0) == 0) {
                throw new Exception($usuario['message'] ?? "No se pudo crear el usuario");
            }

            $idUsuario = $usuario['id_usuario'];

            // Insertar permisos
            foreach ($permisos as $perm) {
                $spPerm = "CALL sp_usuario_permiso_crud('insertar', ?, ?, ?, ?)";
                $this->ejecutarSP($spPerm, [
                    'iiii',
                    $idUsuario,
                    $perm['id_rectoria'],
                    $perm['id_sede'],
                    $perm['id_rol']
                ]);
            }

            $this->responderJson([
                'status' => 1,
                'message' => 'Usuario creado correctamente',
                'id_usuario' => $idUsuario
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al crear usuario: ' . $e->getMessage()
            ]);
        }
    }

    // Actualizar usuario + reemplazar permisos
    public function actualizarUsuario($idUsuario, $data)
    {
        try {
            $correo = $data['correo'] ?? null;
            $estado = $data['estado'] ?? 1;
            $permisos = $data['permisos'] ?? [];

            if (!$correo) {
                throw new Exception("El correo es obligatorio");
            }

            // Actualizar datos básicos del usuario
            $spUsuario = "CALL sp_usuario_crud('actualizar', ?, ?, ?)";
            $resUsuario = $this->ejecutarSp($spUsuario, ['isi', $idUsuario, $correo, $estado]);
            $respuesta = $resUsuario->fetch_assoc();
            $resUsuario->close();

            // Limpiar buffers de SP previos
            while ($this->conexion->more_results() && $this->conexion->next_result()) {
                $this->conexion->use_result();
            }

            $cambiosUsuario = true;
            if (($respuesta['status'] ?? 0) == 0) {
                $mensaje = $respuesta['message'] ?? '';
                if (stripos($mensaje, 'No se realizaron cambios') !== false) {
                    $cambiosUsuario = false;
                } else {
                    throw new Exception($mensaje ?: "No se pudo actualizar el usuario");
                }
            }

            // Obtener los permisos actuales del usuario (para saber cuáles eliminar)
            $spListar = "CALL sp_usuario_permiso_crud('listar', ?, NULL, NULL, NULL, NULL)";
            $resListar = $this->ejecutarSp($spListar, ['i', $idUsuario]);
            $permisosActuales = [];
            while ($fila = $resListar->fetch_assoc()) {
                $permisosActuales[] = $fila;
            }
            $resListar->close();

            // Limpiar buffers
            while ($this->conexion->more_results() && $this->conexion->next_result()) {
                $this->conexion->use_result();
            }

            // Procesar los permisos recibidos
            $idsRecibidos = [];

            foreach ($permisos as $perm) {
                $idPermiso = $perm['id_permiso'] ?? $perm['id'] ?? null;
                $accion = $idPermiso ? 'editar' : 'insertar';

                $query = "CALL sp_usuario_permiso_crud(?, ?, ?, ?, ?, ?)";
                $params = [
                    'siiiii',
                    $accion,
                    $idUsuario,
                    $perm['id_rectoria'],
                    $perm['id_sede'],
                    $perm['id_rol'],
                    $idPermiso
                ];

                $resPerm = $this->ejecutarSp($query, $params);
                $fila = $resPerm->fetch_assoc();
                $resPerm->close();

                while ($this->conexion->more_results() && $this->conexion->next_result()) {
                    $this->conexion->use_result();
                }

                // Validar si el SP de permisos devolvió error
                if (($fila['status'] ?? 1) == 0) {
                    throw new Exception($fila['message'] ?? 'Error al actualizar permiso');
                }

                if ($idPermiso) {
                    $idsRecibidos[] = $idPermiso;
                }
            }

            // Desactivar permisos eliminados (que ya no están en el array recibido)
            foreach ($permisosActuales as $permActual) {
                if (!in_array($permActual['id'], $idsRecibidos)) {
                    $spEliminar = "CALL sp_usuario_permiso_crud('eliminar', ?, ?, ?, ?, ?)";
                    $params = [
                        'iiiii',
                        $idUsuario,
                        $permActual['id_rectoria'],
                        $permActual['id_sede'],
                        $permActual['id_rol'],
                        $permActual['id']
                    ];
                    $this->ejecutarSp($spEliminar, $params);
                    // error_log("Permiso eliminado: " . json_encode($permActual));
                }

                while ($this->conexion->more_results() && $this->conexion->next_result()) {
                    $this->conexion->use_result();
                }
            }

            // Respuesta final
            $this->responderJson([
                'status' => 1,
                'message' => $cambiosUsuario
                    ? 'Usuario y permisos actualizados correctamente'
                    : 'Permisos actualizados correctamente (sin cambios en usuario)'
            ]);
            return;

        } catch (Exception $e) {
            http_response_code(400);
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al actualizar usuario: ' . $e->getMessage()
            ]);
            return;
        }
    }

    // Desactivar usuario
    public function desactivarUsuario($id)
    {
        try {
            $sp = "CALL sp_usuario_crud('desactivar', ?, NULL, NULL)";
            $result = $this->ejecutarSP($sp, ['i', $id]);
            $respuesta = $result->fetch_assoc();
            $result->close();

            $this->responderJson($respuesta);
        } catch (Exception $e) {
            http_response_code(400);
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al desactivar usuario: ' . $e->getMessage()
            ]);
        }
    }

    // Desactivar permiso específico
    public function desactivarPermiso($idPermiso)
    {
        try {
            $query = "CALL sp_usuario_permiso_crud('eliminar', NULL, NULL, NULL, NULL, ?)";
            $res = $this->ejecutarSp($query, ['i', $idPermiso]);
            $data = $res->fetch_assoc();
            $res->close();

            // limpiar buffers del SP
            while ($this->conexion->more_results() && $this->conexion->next_result()) {
                $this->conexion->use_result();
            }

            $this->responderJson([
                'status' => $data['status'] ?? 0,
                'message' => $data['message'] ?? 'Permiso desactivado'
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al desactivar permiso: ' . $e->getMessage()
            ]);
        }
    }

    // Login de usuario (con JWT)
    public function obtenerUsuarioPorCorreo($correo)
    {
        try {
            $sql = "CALL sp_usuario_login(?)";
            $result = $this->ejecutarSP($sql, ['s', $correo]);
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            if (empty($data)) {
                http_response_code(401);
                return $this->responderJson([
                    'status' => 0,
                    'message' => 'Usuario no encontrado o sin permisos activos'
                ]);
            }

            $usuario = [
                'id' => $data[0]['id_usuario'],
                'correo' => $data[0]['correo']
            ];

            $permisos = array_map(fn($p) => [
                // 'id' => $p['id'],
                'id_rectoria' => $p['id_rectoria'],
                'nombre_rectoria' => $p['nombre_rectoria'],
                'id_sede' => $p['id_sede'],
                'nombre_sede' => $p['nombre_sede'],
                'id_rol' => $p['id_rol'],
                'nombre_rol' => $p['nombre_rol']
            ], $data);

            $payload = [
                'id' => $usuario['id'],
                'correo' => $usuario['correo'],
                'permisos' => $permisos,
                'iat' => time(),
                'exp' => time() + (60 * 60 * 4) // 4 horas
            ];

            $token = generarJWT($payload);

            $this->responderJson([
                'status' => 1,
                'message' => 'Login exitoso',
                'token' => $token,
                'usuario' => $usuario + ['permisos' => $permisos]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            $this->responderJson([
                'status' => 0,
                'message' => 'Error interno: ' . $e->getMessage()
            ]);
        }
    }

    
    // Obtener permisos del usuario autenticado (desde token)ks
    public function obtenerPermisosUsuario($idUsuario)
    {
        try {
            if (!$idUsuario) throw new Exception("Usuario no identificado");

            $sql = "SELECT * FROM vw_usuario_permisos WHERE id_usuario = ?";
            $result = $this->ejecutarSP($sql, ['i', $idUsuario]);
            $data = $result->fetch_all(MYSQLI_ASSOC);

            $this->responderJson([
                'status' => 1,
                'message' => 'Permisos obtenidos correctamente',
                'data' => $data
            ]);
        } catch (Exception $e) {
            $this->responderJson(['status' => 0, 'message' => $e->getMessage()]);
        }
    }
}

?>