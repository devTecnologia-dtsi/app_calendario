<?php
include_once __DIR__ . "/../controllers/controller.php";
include_once __DIR__ . "/../../config/dbCalendario.php";


$metodo= $_SERVER['REQUEST_METHOD'];
$path= isset($_SERVER['PATH_INFO'])?$_SERVER['PATH_INFO']:'/';
$buscarid =explode('/', $path);
$id= ($path!=='/') ? end($buscarid):null;
$dato = json_decode(file_get_contents('php://input'), true);

switch($metodo){    

    case 'GET':
        consultar($conexion, $id);
        break;
    // case 'POST':
    //     insertar($conexion,$dato);
    //     break;
    // case 'PUT':
    //     actualizar($conexion, $id, $dato);
    //     break;
    // case 'DELETE':
    //     eliminar($conexion, $id);
    //     break;
    default:
        echo " Metodo no permitido";
        break;
}



?>