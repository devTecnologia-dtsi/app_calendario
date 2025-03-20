<?php
// Importación de modelos
include_once __DIR__ . "/../models/periodo.php";
include_once __DIR__ . "/../models/actividad.php";
include_once __DIR__ . "/../models/subactividad.php";
include_once __DIR__ . "/../models/calendario.php";
include_once __DIR__ . "/../models/usuario.php";
include_once __DIR__ . "/../models/Rolcalendario.php";
include_once __DIR__ . "/../models/rectoria.php";
include_once __DIR__ . "/../models/sede.php";
include_once __DIR__ . "/../models/rol.php";

// CONSULTAR
function consultar($id, $tabla, $limite = 5, $offset = 0) {
    switch ($tabla) {
        case 'actividad':
            $actividad = new crudactividad();
            $actividad->consultaractividad($id);
            break;
        case 'periodo':
            $periodo = new crudperiodo();
            $periodo->consultarperiodo($id);
            break;
        case 'subactividad':
            $subactividad = new crudsubactividad();
            $subactividad->consultarsubactividad($id);
            break;
        case 'calendario':
            $calendario = new crudcalendario();
            $calendario->consultarcalendario($id);
            break;
        case 'rolCalendario':
            $rolcalendario = new crudrolCalendario();
            $rolcalendario->consultarrolCalendario($id);
            break;
        case 'usuario':
            $usuario = new CrudUsuario();
            $id ? $usuario->consultarUsuario($id) : $usuario->listarUsuarios($limite, $offset);
            break;
        case 'rectoria':
            $rectoria = new Rectoria();
            $id ? $rectoria->consultarRectoria($id) : $rectoria->listarRectorias();
            break;
        case 'sede':
            $sede = new Sede();
            $id ? $sede->consultarSede($id) : $sede->listarSedes();
            break;
        case 'sedesPorRectoria':
            $sede = new Sede();
            $sede->listarSedesPorRectoria($id);
            break;
        case 'rol':
            $rol = new Rol();
            $id ? $rol->consultarRol($id) : $rol->listarRol();
            break;
        default:
            echo json_encode(array('ERROR' => 'No se ha encontrado la tabla'));
            break;
    }
}

// INSERTAR
function insertar($dato, $tabla) {
    switch ($tabla) {
        case 'periodo':
            $periodo = new crudperiodo();
            $periodo->insertarperiodo($dato);
            break;
        case 'actividad':
            $actividad = new crudactividad();
            $actividad->insertaractividad($dato);
            break;
        case 'subactividad':
            $subactividad = new crudsubactividad();
            $subactividad->insertarsubactividad($dato);
            break;
        case 'calendario':
            $calendario = new crudcalendario();
            $calendario->insertarcalendario($dato);
            break;
        case 'rolCalendario':
            $calendario = new crudrolCalendario();
            $calendario->insertarrolCalendario($dato);
            break;
        case 'usuario':
            $usuario = new CrudUsuario();
            $usuario->insertarUsuario($dato);
            break;
        case 'rol':
            $rol = new Rol();
            $rol->insertarRol($dato);
            break;
    }
}

// ACTUALIZAR
function actualizar($id, $dato, $tabla) {
    switch ($tabla) {
        case 'periodo':
            $periodo = new crudperiodo();
            $periodo->actualizarperiodo($dato, $id);
            break;
        case 'actividad':
            $actividad = new crudactividad();
            $actividad->actualizaractividad($dato, $id);
            break;
        case 'subactividad':
            $subactividad = new crudsubactividad();
            $subactividad->actualizarsubactividad($dato, $id);
            break;
        case 'calendario':
            $calendario = new crudcalendario();
            $calendario->actualizarcalendario($dato, $id);
            break;
        case 'rolCalendario':
            $rolcalendario = new crudrolCalendario();
            $rolcalendario->actualizarrolCalendario($dato, $id);
            break;
        case 'usuario':
            $usuario = new CrudUsuario();
            $usuario->actualizarUsuario($id, $dato);
            break;
        case 'rol':
            $rol = new Rol();
            $rol->actualizarRol($id, $dato);
            break;
    }
}

// DESACTIVAR
function desactivar($id, $tabla) {
    if ($tabla == 'usuario') {
        $usuario = new CrudUsuario();
        $usuario->desactivarUsuario($id);
    } else {
        echo json_encode(array('ERROR' => 'No se puede desactivar en la tabla ' . $tabla));
    }
}

// ELIMINAR
function eliminar($id, $tabla) {
    switch ($tabla) {
        case 'periodo':
            $periodo = new crudperiodo();
            $periodo->eliminarperiodo($id);
            break;
        case 'actividad':
            $actividad = new crudactividad();
            $actividad->eliminaractividad($id);
            break;
        case 'subactividad':
            $subactividad = new crudsubactividad();
            $subactividad->eliminarsubactividad($id);
            break;
        case 'calendario':
            $calendario = new crudcalendario();
            $calendario->eliminarcalendario($id);
            break;
        case 'rolCalendario':
            $rolcalendario = new crudrolCalendario();
            $rolcalendario->eliminarrolCalendario($id);
            break;
        case 'usuario':
            $usuario = new CrudUsuario();
            $usuario->eliminarUsuario($id);
            break;
        case 'rol':
            $rol = new Rol();
            $rol->eliminarRol($id);
            break;
    }
}

// include_once __DIR__ . "/../models/periodo.php";
// include_once __DIR__ . "/../models/actividad.php";
// include_once __DIR__ . "/../models/subactividad.php";
// include_once __DIR__ . "/../models/calendario.php";
// include_once __DIR__ . "/../models/usuario.php";
// include_once __DIR__ . "/../models/Rolcalendario.php";
// include_once __DIR__ . "/../models/rectoria.php";
// include_once __DIR__ . "/../models/sede.php";
// include_once __DIR__ . "/../models/rol.php";

// function consultar($id, $tabla, $limite = 5, $offset = 0)
// {
//     if ($tabla == 'actividad') {
//         $actividad = new crudactividad();
//         $actividad->consultaractividad($id);
//     } elseif ($tabla == 'periodo') {
//         $periodo = new crudperiodo();
//         $periodo->consultarperiodo($id);
//     } elseif ($tabla == 'subactividad') {
//         $subactividad = new crudsubactividad();
//         $subactividad->consultarsubactividad($id);
//     } elseif ($tabla == 'calendario') {
//         $calendario = new crudcalendario();
//         $calendario->consultarcalendario($id);
//     } elseif ($tabla == 'rolCalendario') {
//         $rolcalendario = new crudrolCalendario();
//         $rolcalendario->consultarrolCalendario($id);
//     } elseif ($tabla == 'usuario') {
//         $usuario = new CrudUsuario();
//         if ($id) {
//             $usuario->consultarUsuario($id);
//         } else {
//             $usuario->listarUsuarios($limite, $offset);
//         }
//     } elseif ($tabla == 'rectoria') { 
//         $rectoria = new Rectoria();
//         if ($id){
//             $rectoria->consultarRectoria($id);
//         } else {
//             $rectoria->listarRectorias();
//         }
//     } elseif ($tabla == 'sede') {
//         $sede = new Sede();
//         if ($id){
//             $sede->consultarSede($id);
//         } else {
//             $sede->listarSedes();
//         }
//     } elseif($tabla == 'sedesPorRectoria'){
//         $sede = new crudSede();
//         $sede->listarSedesPorRectoria($id);
//     } elseif ($tabla == 'rol') {
//         $rol = new Rol();
//         if ($id) {
//             $rol->consultarRol($id);
//         } else {
//             $rol->listarRol();
//         }
//     } else {
//         echo json_encode(array('ERROR' => 'No se ha encontrado la tabla'));
//     }
// }

// function insertar($dato, $tabla)
// {
//     if ($tabla == 'periodo') {
//         $periodo = new crudperiodo();
//         $periodo->insertarperiodo($dato);
//     } elseif ($tabla == 'actividad') {
//         $actividad = new crudactividad();
//         $actividad->insertaractividad($dato);
//     } elseif ($tabla == 'subactividad') {
//         $subactividad = new crudsubactividad();
//         $subactividad->insertarsubactividad($dato);
//     } elseif ($tabla == 'calendario') {
//         $calendario = new crudcalendario();
//         $calendario->insertarcalendario($dato);
//     } elseif ($tabla == 'rolCalendario') {
//         $calendario = new crudrolCalendario();
//         $calendario->insertarrolCalendario($dato);
//     } elseif ($tabla == 'usuario') {
//         $usuario = new CrudUsuario();
//         $usuario->insertarUsuario($dato);
//     } elseif ($tabla == 'rol') {
//         $rol = new crudRol();
//         $rol->insertarRol($dato);
//     }
// }

// function actualizar($id, $dato, $tabla)
// {
//     if ($tabla == 'periodo') {
//         $periodo = new crudperiodo();
//         $periodo->actualizarperiodo($dato, $id);
//     } elseif ($tabla == 'actividad') {
//         $actividad = new crudactividad();
//         $actividad->actualizaractividad($dato, $id);
//     } elseif ($tabla == 'subactividad') {
//         $subactividad = new crudsubactividad();
//         $subactividad->actualizarsubactividad($dato, $id);
//     } elseif ($tabla == 'calendario') {
//         $calendario = new crudcalendario();
//         $calendario->actualizarcalendario($dato, $id);
//     } elseif ($tabla == 'rolCalendario') {
//         $rolcalendario = new crudrolCalendario();
//         $rolcalendario->actualizarrolCalendario($dato, $id);
//     } elseif ($tabla == 'usuario') {
//         $usuario = new CrudUsuario();
//         $usuario->actualizarUsuario( $id, $dato);
//     } elseif ($tabla == 'rol') {
//         $rol = new Rol();
//         $rol->actualizarRol($id, $dato);
//     }
// }

// function desactivar($id, $tabla)
// {
//     if($tabla == 'usuario'){
//         $usuario = new CrudUsuario();
//         $usuario->desactivarUsuario($id);
//     }else {
//         echo json_encode(array('ERROR' => 'No se puede desactivar en la tabla ' . $tabla));
//     }
// }


// function eliminar($id, $tabla)
// {
//     if ($tabla == 'periodo') {
//         $periodo = new crudperiodo();
//         $periodo->eliminarperiodo($id);
//     } elseif ($tabla == 'actividad') {
//         $actividad = new crudactividad();
//         $actividad->eliminaractividad($id);
//     } elseif ($tabla == 'subactividad') {
//         $subactividad = new crudsubactividad();
//         $subactividad->eliminarsubactividad($id);
//     } elseif ($tabla == 'calendario') {
//         $calendario = new crudcalendario();
//         $calendario->eliminarcalendario($id);
//     } elseif ($tabla == 'rolCalendario') {
//         $rolcalendario = new crudrolCalendario();
//         $rolcalendario->eliminarrolCalendario($id);
//     } elseif ($tabla == 'usuario') {
//         $usuario = new CrudUsuario();
//         $usuario->eliminarUsuario($id);
//     } elseif ($tabla == 'rol') {
//         $rol = new crudRol();
//         $rol->eliminarRol($id);
//     }
// }
// ?>
