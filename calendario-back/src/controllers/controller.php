<?php
include_once __DIR__ . "/../models/actividad.php";
include_once __DIR__ . "/../models/periodo.php";
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
            $actividad = new Actividad();
            $actividad->listarActividad();
            $actividad->buscarActividad($id);
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
        case 'actividad':
            $actividad = new Actividad();
            $actividad->insertarActividad($dato);
            break;
        case 'periodo':
            $periodo = new crudperiodo();
            $periodo->insertarperiodo($dato);
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
            $rolcalendario = new crudrolCalendario();
            $rolcalendario->insertarrolCalendario($dato);
            break;
        case 'usuario':
            $usuario = new CrudUsuario();
            $usuario->insertarUsuario($dato);
            break;
        case 'rol':
            $rol = new Rol();
            $rol->insertarRol($dato);
            break;
        default:
            echo json_encode(array('ERROR' => 'No se ha encontrado la tabla para insertar'));
            break;
    }
}

// ACTUALIZAR
function actualizar($id, $dato, $tabla) {
    switch ($tabla) {
        case 'actividad':
            $actividad = new Actividad();
            $actividad->actualizarActividad($id, $dato);
            break;
        case 'periodo':
            $periodo = new crudperiodo();
            $periodo->actualizarperiodo($dato, $id);
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
        default:
            echo json_encode(array('ERROR' => 'No se ha encontrado la tabla para actualizar'));
            break;
    }
}

// DESHABILITAR
function desactivar($id, $tabla) {
    switch ($tabla) {
        case 'usuario':
            $usuario = new CrudUsuario();
            $usuario->desactivarUsuario($id);
            break;
        
        case 'actividad':
            $actividad = new Actividad();
            $actividad->desactivarActividad($id);
            break;

        default:
            echo json_encode(array('ERROR' => 'No se puede deshabilitar en la tabla ' . $tabla));
            break;
    }
}

// ELIMINAR
function eliminar($id, $tabla) {
    switch ($tabla) {
        case 'actividad':
            $actividad = new Actividad();
            $actividad->eliminarActividad($id);
            break;
        case 'periodo':
            $periodo = new crudperiodo();
            $periodo->eliminarperiodo($id);
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
        default:
            echo json_encode(array('ERROR' => 'No se ha encontrado la tabla para eliminar'));
            break;
    }
}

?>