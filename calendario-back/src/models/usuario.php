<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";
include_once __DIR__ . "/baseModelo.php";
include_once __DIR__ . "/../seguridad/jwt_utils.php";

class CrudUsuario extends BaseModelo
{
    /**
     * Listar usuarios con paginación y filtro opcional
     */
    public function listarUsuarios($limite, $offset)
    {
        try {
            $conexion = new conexion();
            $filtro = $_GET['filtro'] ?? null;

            $sql = $conexion->test()->prepare(
                "CALL sp_usuario('ver', NULL, NULL, NULL, NULL, NULL, NULL, ?, ?, ?)"
            );
            $sql->bind_param("iis", $limite, $offset, $filtro);
            $sql->execute();

            // Datos
            $result = $sql->get_result();
            $usuarios = $result->fetch_all(MYSQLI_ASSOC);
            $result->close();

            // Total
            $sql->next_result();
            $totalResult = $sql->get_result();
            $totalUsuarios = $totalResult->fetch_assoc()['total'] ?? 0;

            $this->responderJson([
                'status' => 1,
                'message' => 'Usuarios listados correctamente',
                'total' => $totalUsuarios,
                'data' => $usuarios
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            $this->responderJson([
                'status' => 0,
                'message' => "Error al listar usuarios: " . $e->getMessage()
            ]);
        }
    }

    /**
     * Consultar un usuario por ID
     */
    public function consultarUsuario($id)
    {
        $result = $this->ejecutarSp(
            "CALL sp_usuario('ver_id', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)",
            ["i", $id]
        );
        $usuario = $result->fetch_assoc();
        $result->close();

        if (!$usuario) {
            http_response_code(404);
            return $this->responderJson([
                'status' => 0,
                'message' => 'Usuario no encontrado'
            ]);
        }

        $this->responderJson([
            'status' => 1,
            'message' => 'Usuario encontrado',
            'data' => $usuario
        ]);
    }

    /**
     * Insertar usuario
     */
    public function insertarUsuario($dato)
    {
        try {
            $usuarioAuth = $this->obtenerCorreoDesdeToken();

            // Asegurar dominio
            $correo = $dato['correo_nuevo'];
            if (!str_ends_with($correo, '@uniminuto.edu')) {
                $correo .= '@uniminuto.edu';
            }

            $result = $this->ejecutarSp(
                "CALL sp_usuario('insertar', NULL, ?, ?, ?, ?, ?, NULL, NULL, ?)",
                ['siiiis',
                    $correo,
                    $dato['estado'],
                    $dato['id_rectoria'],
                    $dato['id_sede'],
                    $dato['id_rol'],
                    $usuarioAuth
                ]
            );

            $respuesta = $result->fetch_assoc();
            $result->close();

            if (!$respuesta) {
                http_response_code(400);
                return $this->responderJson([
                    'status' => 0,
                    'message' => 'Error al crear el usuario'
                ]);
            }

            $this->responderJson($respuesta);
        } catch (Exception $e) {
            http_response_code(400);
            $this->responderJson([
                'status' => 0,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Actualizar usuario
     */
    public function actualizarUsuario($id, $dato)
    {
        try {
            $usuarioAuth = $this->obtenerCorreoDesdeToken();

            $correo = $dato['correo_nuevo'];
            if (!str_ends_with($correo, '@uniminuto.edu')) {
                $correo .= '@uniminuto.edu';
            }

            $result = $this->ejecutarSp(
                "CALL sp_usuario('actualizar', ?, ?, ?, ?, ?, ?, NULL, NULL, ?)",
                ['isiiiis',
                    $id,
                    $correo,
                    $dato['estado'],
                    $dato['id_rectoria'],
                    $dato['id_sede'],
                    $dato['id_rol'],
                    $usuarioAuth
                ]
            );

            $respuesta = $result->fetch_assoc();
            $result->close();

            $this->responderJson($respuesta);
        } catch (Exception $e) {
            http_response_code(400);
            $this->responderJson([
                'status' => 0,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Desactivar usuario
     */
    public function desactivarUsuario($id)
    {
        try {
            $usuarioAuth = $this->obtenerCorreoDesdeToken();

            $result = $this->ejecutarSp(
                "CALL sp_usuario('desactivar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?)",
                ["is", $id, $usuarioAuth]
            );

            $respuesta = $result->fetch_assoc();
            $result->close();

            $this->responderJson($respuesta);
        } catch (Exception $e) {
            http_response_code(400);
            $this->responderJson([
                'status' => 0,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Eliminar usuario (opcional)
     */
    public function eliminarUsuario($id)
    {
        try {
            $usuarioAuth = $this->obtenerCorreoDesdeToken();

            $result = $this->ejecutarSp(
                "CALL sp_usuario('eliminar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?)",
                ["is", $id, $usuarioAuth]
            );

            $respuesta = $result->fetch_assoc();
            $result->close();

            $this->responderJson($respuesta);
        } catch (Exception $e) {
            http_response_code(400);
            $this->responderJson([
                'status' => 0,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Login: Obtener usuario y permisos por correo
     */
    public function obtenerUsuarioPorCorreo($correo)
    {
        $result = $this->ejecutarSp(
            "SELECT * FROM usuario WHERE correo = ? AND estado = 1",
            ["s", $correo]
        );
        $permisos = $result->fetch_all(MYSQLI_ASSOC);
        $result->close();

        if (count($permisos) === 0) {
            http_response_code(401);
            return $this->responderJson([
                "status" => 0,
                "message" => "No tienes permisos asignados"
            ]);
        }

        // Generar token con todos los permisos
        $token = generarJWT([
            'correo' => $correo,
            'permisos' => $permisos
        ]);

        $this->responderJson([
            "status" => 1,
            "message" => "Login exitoso",
            "token" => $token,
            "usuario" => $permisos
        ]);
    }
}

?>