<?php

include_once __DIR__ . "/../controllers/controller.php";
include_once __DIR__ . "/../../config/cors.php";

// Detectar método HTTP y path
$metodo = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '/';

// Extraer partes del path
$partesPath = explode('/', trim($path, '/'));
$tabla = $partesPath[0] ?? null;
$accion = $partesPath[1] ?? null;
$id = isset($partesPath[1]) && is_numeric($partesPath[1]) ? intval($partesPath[1]) : null;

// Captura de parámetros limite y offset desde la URL (paginación)
$limite = isset($_GET['limite']) ? intval($_GET['limite']) : 10;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

// Leer el cuerpo de la petición si es necesario
$dato = json_decode(file_get_contents('php://input'), true);

// Validar si se pasó una tabla válida
if (!$tabla) {
    http_response_code(400);
    echo json_encode(["error" => "Tabla no especificada"]);
    exit;
}

// Manejo de métodos
switch ($metodo) {
    case 'GET':

        if ($tabla === 'rectoria') {
            //Consultar rectorías
            $rectoria = new Rectoria();
            if ($id) {
                $rectoria->consultarRectoria($id);
            } else {
                $rectoria->listarRectorias();
            }
        } 
        
        elseif ($tabla === 'sede') {
            //Consultar sedes
            $sede = new Sede();
            if ($id) {
                $sede->consultarSede($id);
            } else {
                $sede->listarSedes();
            }

        } elseif ($tabla === 'sedesPorRectoria') {
            // Listar sedes por rectoría
            $sede = new Sede();
            if ($id) {
                $sede->listarSedesPorRectoria($id);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "ID de rectoría no especificado"]);
                exit;
            }
        } elseif ($tabla === 'rol') {
            // Consultar rol específico o todos
            $rol = new Rol();
            if ($id) {
                $rol->consultarRol($id);
            } else {
                $rol->listarRol();
            }

        } elseif ($tabla === 'usuario') {
            // Consultar usuario específico o todos
            $usuario = new CrudUsuario();
            if ($id) {
                $usuario->consultarUsuario($id);
            } else {
                $usuario->listarUsuarios($limite, $offset);
            }

        } elseif ($tabla === 'actividad') {
            // Ver una actividad específica o todas
            $actividad = new Actividad();
            if ($id) {
                $actividad->buscarActividad($id);
            } else {
                $actividad->listarActividad();
            }

        } else {
            consultar($id, $tabla, $limite, $offset);
        }
        break;

    case 'POST':

        if ($tabla === 'usuario'){
            //insertar usuario
            $usuario = new CrudUsuario();
            $usuario->insertarUsuario($dato);
        }

        elseif ($tabla === 'actividad') {
            // Insertar actividad
            $actividad = new Actividad();
            $actividad->insertarActividad($dato);

        } else {
            insertar($dato, $tabla);
        }
        break;

    case 'PUT':
        if ($id === null) {
            http_response_code(400);
            echo json_encode(["error" => "ID no especificado para actualización"]);
            exit;
        }

        if ($tabla === 'usuario') {
            // Actualizar usuario
            $usuario = new CrudUsuario();
            $usuario->actualizarUsuario($id, $dato);
        }

        elseif ($tabla === 'rol'){
            // Actualizar rol
            $rol = new Rol();
            $rol->actualizarRol($id, $dato);
        }

        elseif ($tabla === 'actividad') {
            // Actualizar actividad
            $actividad = new Actividad();
            // var_dump($dato); exit;
            $actividad->actualizarActividad($id, $dato);
        } else {
            actualizar($id, $dato, $tabla);
        }
        break;

    case 'PATCH':
        if ($id === null) {
            http_response_code(400);
            echo json_encode(["error" => "ID no especificado para deshabilitación"]);
            exit;
        }

        if ($tabla === 'usuario') {
            // Deshabilitar usuario
            $usuario = new CrudUsuario();
            $usuario->desactivarUsuario($id);
        }

        elseif ($tabla === 'actividad') {
            // Deshabilitar actividad
            $actividad = new Actividad();
            $actividad->desactivarActividad($id);
        } else {
            desactivar($id, $tabla);
        }
        break;

    case 'DELETE':
        if ($id === null) {
            http_response_code(400);
            echo json_encode(["error" => "ID no especificado para eliminación"]);
            exit;
        }
        
        if( $tabla === 'usuario') {
            // Eliminar usuario
            $usuario = new CrudUsuario();
            $usuario->eliminarUsuario($id);
        }

        elseif ($tabla === 'actividad') {
            // Eliminar actividad
            $actividad = new Actividad();
            $actividad->eliminarActividad($id);

        } else {
            eliminar($id, $tabla);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode([["error" => "Método no permitido"]]);
        break;
}
