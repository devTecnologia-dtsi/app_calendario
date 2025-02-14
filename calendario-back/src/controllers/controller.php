<?php

include_once __DIR__ . "/../models/periodo.php";
include_once __DIR__ . "/../models/actividad.php";
include_once __DIR__ . "/../models/subactividad.php";
include_once __DIR__ . "/../models/calendario.php";
include_once __DIR__ . "/../models/usuario.php";
include_once __DIR__ . "/../models/Rolcalendario.php";

// Incluír los modelos faltantes

function consultar($id, $tabla, $correo)
{

    $correo = base64_decode($correo); //recibe el correo en base 64 de parte del frontend como un query param
    //la sintaxis se aplica al endpoint de la siguiente forma: /nombretabla/id?=queryparamdelcorreo(base64)(solo si es peticion get o delete)
    if ($tabla == 'actividad') {
        $actividad = new crudactividad();
        $actividad->consultaractividad($id, $correo);
    } elseif ($tabla == 'periodo') {

        $periodo = new crudperiodo();
        $periodo->consultarperiodo($id, $correo);
    } elseif ($tabla == 'subactividad') {

        $subactividad = new crudsubactividad();
        $subactividad->consultarsubactividad($id, $correo);
    } elseif ($tabla == 'calendario') {

        $calendario = new crudcalendario();
        $calendario->consultarcalendario($id, $correo);
    } elseif ($tabla == 'rolCalendario') {

        $rolcalendario = new crudrolCalendario();
        $rolcalendario->consultarrolCalendario($id, $correo);
    } elseif ($tabla == 'usuario') {

        $usuario = new crudusuario();
        $usuario->consultarusuario($id, $correo);

    } elseif ($tabla == 'usuario') {

        $usuario = new crudusuario();
        $usuario->consultarusuario($id, $correo);

    }

    //crear una clase para las funciones de consulta de las vistas de la bd
}

function insertar($dato, $tabla, $correo)
{
    //la sintaxis se aplica al endpoint de la siguiente forma: /nombretabla/id(solo si es peticion get o delete)
    $correo = base64_decode($correo); //recibe el correo en base 64 de parte del frontend como un query param

    if ($tabla == 'periodo') {

        $periodo = new crudperiodo();
        $periodo->insertarperiodo($dato, $correo);
    } elseif ($tabla == 'actividad') {

        $actividad = new crudactividad();
        $actividad->insertaractividad($dato, $correo);
    } elseif ($tabla == 'subactividad') {

        $subactividad = new crudsubactividad();
        $subactividad->insertarsubactividad($dato, $correo);
    } elseif ($tabla == 'calendario') {

        $calendario = new crudcalendario();
        $calendario->insertarcalendario($dato, $correo);
    } elseif ($tabla == 'rolCalendario') {

        $calendario = new crudrolCalendario();
        $calendario->insertarrolCalendario($dato, $correo);
    }elseif ($tabla == 'usuario') {

        $calendario = new crudusuario();
        $calendario->insertarusuario($dato, $correo);
    }
}

function actualizar($id, $dato, $tabla, $correo)
{
    $correo = base64_decode($correo); //recibe el correo en base 64 de parte del frontend como un query param
    //la sintaxis se aplica al endpoint de la siguiente forma: /nombretabla/id(solo si es peticion get o delete)
    if ($tabla == 'periodo') {

        $periodo = new crudperiodo();
        $periodo->actualizarperiodo($dato, $id, $correo);
    } elseif ($tabla == 'actividad') {

        $actividad = new crudactividad();
        $actividad->actualizaractividad($dato, $id, $correo);

    } elseif ($tabla == 'subactividad') {

        $subactividad = new crudsubactividad();
        $subactividad->actualizarsubactividad($dato, $id, $correo);

    } elseif ($tabla == 'calendario') {

        $calendario = new crudcalendario();
        $calendario->actualizarcalendario($dato, $id, $correo);
    } elseif ($tabla == 'rolCalendario') {

        $rolcalendario = new crudrolCalendario();
        $rolcalendario->actualizarrolCalendario($dato, $id, $correo);

    } elseif ($tabla == 'usuario') {

        $usuario = new crudusuario();
        $usuario->actualizarusuario($dato, $id, $correo);
    }
}

function eliminar($id, $tabla, $correo)
{
    $correo = base64_decode($correo); //recibe el correo en base 64 de parte del frontend como un query param
    //la sintaxis se aplica al endpoint de la siguiente forma: /nombretabla/id/correo(base64)(solo si es peticion get o delete)
    if ($tabla == 'periodo') {

        $periodo = new crudperiodo();
        $periodo->eliminarperiodo($id, $correo);

    } elseif ($tabla == 'actividad') {

        $actividad = new crudactividad();
        $actividad->eliminaractividad($id, $correo);

    } elseif ($tabla == 'subactividad') {

        $subactividad = new crudsubactividad();
        $subactividad->eliminarsubactividad($id, $correo);

    } elseif ($tabla == 'calendario') {

        $calendario = new crudcalendario();
        $calendario->eliminarcalendario($id, $correo);

    } elseif ($tabla == 'rolCalendario') {

        $rolcalendario = new crudrolCalendario();
        $rolcalendario->eliminarrolCalendario($id, $correo);

    }elseif ($tabla == 'usuario'){

        $usuario = new crudusuario();
        $usuario->eliminarusuario($id, $correo);
        
    }
}
