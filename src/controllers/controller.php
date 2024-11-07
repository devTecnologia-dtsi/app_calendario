<?php

include_once __DIR__ . "/../models/periodo.php";

echo "hola controler";
// Incluír los modelos faltantes 
// Instanciar cada clase del modelo (La lógica de cada tabla de la DB)
// Llamar las funciones de la clase $instancia->nombreFuncion(param1, param2);


function consultar($conexion, $id){


    //Insatnciar la clase del modelo
    // print_r($conexion);
    echo $id;
}
