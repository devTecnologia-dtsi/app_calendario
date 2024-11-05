<?php

define('host','10.0.20.189');
$user= "root";  
$password= "Jailton81*";
$db= "calendarios";
$port = "3306";

$conexion= new mysqli(host, $user, $password, $db, $port);

if($conexion->connect_error){

    die("conexion no establecida". $conexion ->connect_error);
}

?>