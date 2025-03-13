<?php

include_once __DIR__ . "/../models/periodo.php";
include_once __DIR__ . "/../models/actividad.php";
include_once __DIR__ . "/../models/subactividad.php";
include_once __DIR__ . "/../models/calendario.php";
include_once __DIR__ . "/../models/usuario.php";
include_once __DIR__ . "/../models/Rolcalendario.php";
include_once __DIR__ . "/../models/rectoria.php";
include_once __DIR__ . "/../models/sede.php";
include_once __DIR__ . "/../models/rol.php";

function consultar($id, $tabla)
{
    if ($tabla == 'actividad') {
        $actividad = new crudactividad();
        $actividad->consultaractividad($id);
    } elseif ($tabla == 'periodo') {
        $periodo = new crudperiodo();
        $periodo->consultarperiodo($id);
    } elseif ($tabla == 'subactividad') {
        $subactividad = new crudsubactividad();
        $subactividad->consultarsubactividad($id);
    } elseif ($tabla == 'calendario') {
        $calendario = new crudcalendario();
        $calendario->consultarcalendario($id);
    } elseif ($tabla == 'rolCalendario') {
        $rolcalendario = new crudrolCalendario();
        $rolcalendario->consultarrolCalendario($id);
    } elseif ($tabla == 'usuario') {
        $usuario = new crudusuario();
        if ($id) {
            $usuario->consultarUsuario($id);
        } else {
            $usuario->listarUsuarios();
        }
    } elseif ($tabla == 'rectoria') { 
        $rectoria = new crudRectoria();
        if ($id){
            $rectoria->consultarRectoria($id);
        } else {
            $rectoria->listarRectorias();
        }
    } elseif ($tabla == 'sede') {
        $sede = new crudSede();
        if ($id){
            $sede->consultarSede($id);
        } else {
            $sede->listarSedes();
        }
    } elseif($tabla == 'sedesPorRectoria'){
        $sede = new crudSede();
        $sede->listarSedesPorRectoria($id);
    } elseif ($tabla == 'rol') {
        $rol = new crudRol();
        if ($id) {
            $rol->consultarRol($id);
        } else {
            $rol->listarRoles();
        }
    } else {
        echo json_encode(array('ERROR' => 'No se ha encontrado la tabla'));
    }
}

function insertar($dato, $tabla)
{
    if ($tabla == 'periodo') {
        $periodo = new crudperiodo();
        $periodo->insertarperiodo($dato);
    } elseif ($tabla == 'actividad') {
        $actividad = new crudactividad();
        $actividad->insertaractividad($dato);
    } elseif ($tabla == 'subactividad') {
        $subactividad = new crudsubactividad();
        $subactividad->insertarsubactividad($dato);
    } elseif ($tabla == 'calendario') {
        $calendario = new crudcalendario();
        $calendario->insertarcalendario($dato);
    } elseif ($tabla == 'rolCalendario') {
        $calendario = new crudrolCalendario();
        $calendario->insertarrolCalendario($dato);
    } elseif ($tabla == 'usuario') {
        $usuario = new crudusuario();
        $usuario->insertarUsuario($dato);
    } elseif ($tabla == 'rol') {
        $rol = new crudRol();
        $rol->insertarRol($dato);
    }
}

function actualizar($id, $dato, $tabla)
{
    if ($tabla == 'periodo') {
        $periodo = new crudperiodo();
        $periodo->actualizarperiodo($dato, $id);
    } elseif ($tabla == 'actividad') {
        $actividad = new crudactividad();
        $actividad->actualizaractividad($dato, $id);
    } elseif ($tabla == 'subactividad') {
        $subactividad = new crudsubactividad();
        $subactividad->actualizarsubactividad($dato, $id);
    } elseif ($tabla == 'calendario') {
        $calendario = new crudcalendario();
        $calendario->actualizarcalendario($dato, $id);
    } elseif ($tabla == 'rolCalendario') {
        $rolcalendario = new crudrolCalendario();
        $rolcalendario->actualizarrolCalendario($dato, $id);
    } elseif ($tabla == 'usuario') {
        $usuario = new crudusuario();
        $usuario->actualizarUsuario($dato, $id);
    } elseif ($tabla == 'rol') {
        $rol = new crudRol();
        $rol->actualizarRol($id, $dato);
    }
}

function desactivar($id, $tabla)
{
    if($tabla == 'usuario'){
        $usuario = new crudusuario();
        $usuario->desactivarUsuario($id);
    }else {
        echo json_encode(array('ERROR' => 'No se puede desactivar en la tabla ' . $tabla));
    }
}


function eliminar($id, $tabla)
{
    if ($tabla == 'periodo') {
        $periodo = new crudperiodo();
        $periodo->eliminarperiodo($id);
    } elseif ($tabla == 'actividad') {
        $actividad = new crudactividad();
        $actividad->eliminaractividad($id);
    } elseif ($tabla == 'subactividad') {
        $subactividad = new crudsubactividad();
        $subactividad->eliminarsubactividad($id);
    } elseif ($tabla == 'calendario') {
        $calendario = new crudcalendario();
        $calendario->eliminarcalendario($id);
    } elseif ($tabla == 'rolCalendario') {
        $rolcalendario = new crudrolCalendario();
        $rolcalendario->eliminarrolCalendario($id);
    } elseif ($tabla == 'usuario') {
        $usuario = new crudusuario();
        $usuario->eliminarUsuario($id);
    } elseif ($tabla == 'rol') {
        $rol = new crudRol();
        $rol->eliminarRol($id);
    }
}
?>
