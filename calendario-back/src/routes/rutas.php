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
        if ($tabla === 'sedesPorRectoria') {
            // Consultar sedes por rectoría
            $sede = new Sede();
            $sede->listarSedesPorRectoria($id);
        } elseif ($tabla === 'actividad') {
            // Ver una actividad específica o todas
            $actividad = new Actividad();
            if ($id) {
                $actividad->gestionarActividad('ver', ['id' => $id]);
            } else {
                $actividad->gestionarActividad('ver', $dato);
            }
        } else {
            consultar($id, $tabla, $limite, $offset);
        }
        break;

    case 'POST':
        if ($tabla === 'actividad') {
            // Insertar actividad
            $actividad = new Actividad();
            $actividad->gestionarActividad('insertar', $dato);
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
        if ($tabla === 'actividad') {
            // Actualizar actividad
            $actividad = new Actividad();
            $actividad->gestionarActividad('actualizar', $dato);
        } else {
            actualizar($id, $dato, $tabla);
        }
        break;

    case 'PATCH':
        if ($id === null) {
            http_response_code(400);
            echo json_encode(["error" => "ID no especificado para desactivación"]);
            exit;
        }
        if ($tabla === 'actividad') {
            // Deshabilitar actividad
            $actividad = new Actividad();
            $actividad->gestionarActividad('deshabilitar', $dato);
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
        if ($tabla === 'actividad') {
            // Eliminar actividad
            $actividad = new Actividad();
            $actividad->gestionarActividad('eliminar', $dato);
        } else {
            eliminar($id, $tabla);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode([["error" => "Método no permitido"]]);
        break;
}



// include_once __DIR__ . "/../controllers/controller.php";
// include_once __DIR__ . "/../../config/cors.php";

// // Detectar método HTTP y path
// $metodo = $_SERVER['REQUEST_METHOD'];
// $path = $_SERVER['PATH_INFO'] ?? '/';

// // Extraer partes del path
// $partesPath = explode('/', trim($path, '/'));
// $tabla = $partesPath[0] ?? null;
// $accion = $partesPath[1] ?? null;
// $id = isset($partesPath[1]) && is_numeric($partesPath[1]) ? intval($partesPath[1]) : null;

// // Captura de parámetros limite y offset desde la URL (paginación)
// $limite = isset($_GET['limite']) ? intval($_GET['limite']) : 10;
// $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

// // Leer el cuerpo de la petición si es necesario
// $dato = json_decode(file_get_contents('php://input'), true);

// // Validar si se pasó una tabla válida
// if (!$tabla) {
//     http_response_code(400);
//     echo json_encode(["error" => "Tabla no especificada"]);
//     exit;
// }

// // Manejo de métodos
// switch ($metodo) {
//     case 'GET':
//         if ($tabla === 'sedesPorRectoria') {
//             $sede = new Sede();
//             $sede->listarSedesPorRectoria($id);
//         } else {
//             consultar($id, $tabla, $limite, $offset);
//         }
//         break;

//     case 'POST':
//         insertar($dato, $tabla);
//         break;

//     case 'PUT':
//         if ($id === null) {
//             http_response_code(400);
//             echo json_encode(["error" => "ID no especificado para actualización"]);
//             exit;
//         }
//         actualizar($id, $dato, $tabla);
//         break;

//     case 'PATCH':
//         if ($id === null) {
//             http_response_code(400);
//             echo json_encode(["error" => "ID no especificado para desactivación"]);
//             exit;
//         }
//         desactivar($id, $tabla);
//         break;

//     case 'DELETE':
//         if ($id === null) {
//             http_response_code(400);
//             echo json_encode(["error" => "ID no especificado para eliminación"]);
//             exit;
//         }
//         eliminar($id, $tabla);
//         break;

//     default:
//         http_response_code(405);
//         echo json_encode([["error" => "Método no permitido"]]);
//         break;
// }
?>
