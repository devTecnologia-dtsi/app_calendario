<?php
include_once __DIR__ . "/../controllers/controller.php";



$metodo = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '/';
$buscartabla = explode('/', $path);
$tabla =  ($path !== '/') ? end($buscartabla) : null;;
$tabla = $buscartabla[1];
$buscarid = explode('/', $path);
$id = ($path !== '/' . $tabla . '/') ? end($buscarid) : null;
$dato = json_decode(file_get_contents('php://input'), true);

$correo = $_GET["user"];

switch ($metodo) {

    case 'GET':
        
        consultar($id, $tabla, $correo);
        break;

    case 'POST':
        
        insertar($dato, $tabla, $correo);
        break;

    case 'PUT':
        
        actualizar($id, $dato, $tabla, $correo);
        break;

    case 'DELETE':
        eliminar($id, $tabla, $correo);
        break;
    default:
        echo " Metodo no permitido";
        break;
}
