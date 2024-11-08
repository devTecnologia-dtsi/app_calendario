<?php

include_once __DIR__ . "/../models/periodo.php";
include_once __DIR__ . "/../models/actividad.php";
#include_once __DIR__ . "/../../config/dbCalendario.php";

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
        consultar($id);
        break;
    case 'POST':
         insertar($dato);
         break;
    case 'PUT':
         actualizar($conexion, $id, $dato);
         break;
    case 'DELETE':
        eliminar( $conexion,$id);
         break;
    default:
        echo " Metodo no permitido";
        break;
}


function consultar($id){
    $periodo = new crudperiodo(); 
    $periodo->consultarperiodo($id);
    #$actividad = new crudactividad();
    #$actividad->consultaractividad($id);
    //$pruebac = new prueba();
    //$pruebac->conecct();

    //Insatnciar la clase del modelo
    // print_r($conexion);
}


function insertar($dato){
    $conexion = new conexion();
    $periodo = new crudperiodo();
    $periodo->insertarperiodo($conexion, $dato);
    #$actividad = new crudactividad();
    #$actividad->insertaractividad($conexion,$dato);
    
    //Insatnciar la clase del modelo
    // print_r($conexion);
}

function actualizar($conexion, $dato, $id){
    //$periodo = new crudperiodo();
    //$periodo->actualizarperiodo($conexion, $dato, $id);
    $actividad = new crudactividad();
    $actividad->actualizaractividad($conexion, $dato, $id);
    
    //Insatnciar la clase del modelo
    // print_r($conexion);
}

function eliminar($id){
   // $periodo = new crudperiodo();
   //$periodo->eliminarperiodo($conexion, $id);
   $actividad = new crudactividad();
   $actividad->eliminaractividad($id);
    
    //Insatnciar la clase del modelo
    // print_r($conexion);
}

