<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";

class CrudUsuario {
    
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

    private function responderJson($respuesta) 
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($respuesta);
        exit;
    }

    public function listarUsuarios($limite, $offset) {
        $conexion = new conexion();
        $sql = $conexion->test()->prepare("CALL sp_usuario('ver', NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)");
        $sql->bind_param("ii", $limite, $offset);
        $sql->execute();
    
        // Obtener usuarios
        $result = $sql->get_result();
        $usuarios = $result->fetch_all(MYSQLI_ASSOC);
        $result->close();
        
        // Mover puntero al siguiente resultado (el total)
        $sql->next_result();
        $totalResult = $sql->get_result();
        $totalUsuarios = $totalResult->fetch_assoc()['total'];
    
        // Respuesta
        $this->responderJson([
            'status' => 1,
            'message' => 'Usuarios listados correctamente',
            'total' => $totalUsuarios,
            'data' => $usuarios
        ]);
    }
    
    public function consultarUsuario($id) {
        $result = $this->ejecutarSp("CALL sp_usuario('ver_id', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)",
        ["i",$id]);
        $usuario = $result->fetch_assoc();
        
        $this->responderJson([
            'status' => $usuario ? 1:0,
            'message' => $usuario ? 'Usuario encontrado' : 'Usuario no encontrado',
            'data' => $usuario
        ]);
    }

        public function insertarUsuario($dato)
    {
        try {
            $respuesta = $this->ejecutarSP("CALL sp_usuario('insertar', NULL, ?, ?, ?, ?, NULL, ?, NULL, NULL)",
             [
                'siiii',
                $dato['correo_nuevo'], 
                $dato['estado'], 
                $dato['id_rectoria'],
                $dato['id_sede'],
                $dato['id_rol']
            ]);
            

            $this->responderJSON($respuesta);
        } catch (Exception $e) {
            http_response_code(400);
            $this->responderJSON([
                'error' => true,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function actualizarUsuario($id, $dato)
    {
        try {
            // Ejecutar SP
            $result = $this->ejecutarSP(
                "CALL sp_usuario('actualizar', ?, ?, ?, ?, ?, NULL, ?, NULL, NULL)",
                [
                    'isiiii',
                    $id,
                    $dato['correo_nuevo'],
                    $dato['estado'],
                    $dato['id_rectoria'],
                    $dato['id_sede'],
                    $dato['id_rol']
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
    
    public function desactivarUsuario($id){
        $result = $this->ejecutarSp("CALL sp_usuario('desactivar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL )",
         ["i", $id]);
         $respuesta = $result->fetch_assoc();
         $this->responderJson($respuesta);
    }

    // No se usa, pero se deja funcional en caso de implementación
    public function eliminarUsuario($id) {
        $result = $this->ejecutarSP("CALL sp_usuario('eliminar', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)",
         ["i", $id]);
        $respuesta = $result->fetch_assoc();
        $this->responderJson($respuesta);
    }
}

?>