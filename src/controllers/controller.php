<?php

include_once __DIR__ . "/../models/periodo.php";
include_once __DIR__ . "/../models/actividad.php";
include_once __DIR__ . "/../../config/dbCalendario.php";

// Incluír los modelos faltantes 
// Instanciar cada clase del modelo (La lógica de cada tabla de la DB)
// Llamar las funciones de la clase $instancia->nombreFuncion(param1, param2);

//$elimianr = new Eliminar();

$metodo= $_SERVER['REQUEST_METHOD'];
$path= isset($_SERVER['PATH_INFO'])?$_SERVER['PATH_INFO']:'/';
$buscarid =explode('/', $path);
$id= ($path!=='/') ? end($buscarid):null;
$dato = json_decode(file_get_contents('php://input'), true);

switch($metodo){    

    case 'GET':
        consultar($conexion, $id);
        break;
    case 'POST':
         insertar($conexion,$dato);
         break;
    case 'PUT':
         actualizar($conexion, $id, $dato);
         break;
    case 'DELETE':
         eliminar($conexion, $id);
         break;
    default:
        echo " Metodo no permitido";
        break;
}


function consultar($conexion, $id){
    $periodo = new crudperiodo();
    $periodo->consultarperiodo($conexion, $id);
    //$actividad = new crudactividad();
    //$actividad->consultaractividad($conexion, $id);

    //Insatnciar la clase del modelo
    // print_r($conexion);
}


function insertar($conexion, $dato){
    $periodo = new crudperiodo();
    $periodo->insertarperiodo($conexion, $dato);
    
    //Insatnciar la clase del modelo
    // print_r($conexion);
}

function actualizar($conexion, $dato, $id){
    $periodo = new crudperiodo();
    $periodo->actualizarperiodo($conexion, $dato, $id);
    
    //Insatnciar la clase del modelo
    // print_r($conexion);
}

function eliminar($conexion, $id){
    $periodo = new crudperiodo();
    $periodo->eliminarperiodo($conexion, $id);
    
    //Insatnciar la clase del modelo
    // print_r($conexion);
}