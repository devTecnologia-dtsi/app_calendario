<?php

include_once __DIR__ . "/../../config/conexion.php";


class crudsubactividad
{

    public function consultarsubactividad($id, $correo)
    {

        try {

            if (!isset($correo)) {
                $res = array(["error" => " el correo es obligatorio"]);
                echo json_encode($res);
                exit;
            }

            $conexion = new conexion();
            $sql = $conexion->test()->prepare("select correo from usuario where correo = ?");

            $sql->bind_param("s", $correo);
            $sql->execute();

            $result = $sql->get_result();

            $row = $result->fetch_assoc();

            if (isset($row['correo']) == null) { //si el correo ingresado, no existe arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {


                if ($id == null) {

                    $sql =  $conexion->test()->prepare("call sp_subActividad('ver', null, null, null, null, null, null, null, ? );");
                    $sql->bind_param('s', $correo);
                } else {

                    $sql =  $conexion->test()->prepare("call sp_subActividad('ver', ? , null, null, null, null, null, null, ?);");
                    $sql->bind_param('is', $id, $correo);
                }

                $sql->execute();
                $resultado =  $sql->get_result();

                if ($resultado) {
                    $datos = array(); //mete los datos de cada registro de la base de datos en un arreglo

                    while ($fila = $resultado->fetch_assoc()) { //guarda los datos usando un bucle while y recorriendo el arreglo con fetch_assoc
                        $datos[] = $fila;
                    }
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode($datos);
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function insertarsubactividad($dato, $correo)
    {

        try {


            if (!isset($correo)) {
                $res = array(["error" => "El correo es obligatorio."]);
                echo json_encode($res);
                exit;
            }

            $conexion = new conexion();
            $sql = $conexion->test()->prepare("select correo from usuario where correo = ?");

            $sql->bind_param("s", $correo);
            $sql->execute();

            $result = $sql->get_result();

            $row = $result->fetch_assoc();


            if (isset($row['correo']) == null) { //si el correo ingresado no existe, arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {

                $nombre = isset($dato['nombre']) ? $dato['nombre'] : null;
                $id_usuario = isset($dato['id_usuario']) ? $dato['id_usuario'] : null;
                $id_actividad = isset($dato['id_actividad']) ? $dato['id_actividad'] : null;
                $fechaInicio = isset($dato['fechaInicio']) ? $dato['fechaInicio'] : null;
                $fechaFin = isset($dato['fechaFin']) ? $dato['fechaFin'] : null;
                $estado = isset($dato['estado']) ? $dato['estado'] : null;

                $sql = $conexion->test()->prepare("call sp_subActividad('insertar', null, ?, ?, ?, ?, ?, ?, ?)");

                $sql->bind_param('siissis', $nombre, $id_usuario, $id_actividad, $fechaInicio, $fechaFin, $estado, $correo);

                $sql->execute();

                $resultado = $sql->get_result();

                header('Content-Type: application/json; charset=utf-8');

                //toma el id del autoincremental del sp
                if ($resultado) {
                    echo json_encode(array('mensaje' => 'Nueva subactividad insertada'));
                } else {
                    throw new Exception('Error en la insercion de datos');
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function eliminarsubactividad($id, $correo)
    {

        try {


            if (!isset($id) || !isset($correo)) {
                $res = array(["error" => "El id y el correo son obligatorios."]);
                echo json_encode($res);
                exit;
            }
            $conexion = new conexion();
            $sql = $conexion->test()->prepare("select correo from usuario where correo = ?");

            $sql->bind_param("s", $correo);
            $sql->execute();

            $result = $sql->get_result();

            $row = $result->fetch_assoc();


            $usuario = new crudusuario();
            $perfil = $usuario->consultarrolusuario($correo);


            if ($id == null) { //si el correo ingresado no existe, arroja este error
                throw new Exception('No ha ingresado el id de la subactividad a eliminar');
            }


            if ($perfil[0]['borrar'] != 1) { //si el correo no tiene permisos para borrar(no es del admin) saldra este error
                // var_dump($perfil[0]['borrar']);
                throw new Exception('Usted no tiene permiso para borrar este registro, por favor contacte con el administrador de la aplicacion');
            }


            $sqlid = $conexion->test()->prepare("select id from subActividad where id = ? ;");

            $sqlid->bind_param("i", $id);
            $sqlid->execute();

            $result = $sqlid->get_result();

            $idregistrado = $result->fetch_assoc();

            $idverificado = isset($idregistrado['id']) ? $idregistrado['id'] : null;

            if ($idverificado == null) { //si el id usado ya fue borrado una primera vez o todavia no tiene un registro asignado, arroja este error
                throw new Exception('El registro de este id ya ha sido borrado o no ha sido creado');
            } else {
                if ($row['correo'] == null) { //si el correo ingresado no existe, arroja este error
                    throw new Exception('El usuario con el correo ' . $correo . ' no esta registrado.');
                } else {
                    $sqlestado = $conexion->test()->prepare("select estado from subActividad where id = ?;");

                    $sqlestado->bind_param("i", $id);
                    $sqlestado->execute();

                    $result = $sqlestado->get_result();

                    $estadoregistrado = $result->fetch_assoc();
                    $estadoverificado = $estadoregistrado['estado'];

                    if ($estadoverificado == 1) { // si su estado es uno no se puede eliminar ese registro

                        throw new Exception('No se puede eliminar la subactividad porque se encuentra activa');
                    }

                    $sql = $conexion->test()->prepare("call sp_subActividad('eliminar', ?, null, null, null, null, null, null, ?);");

                    $sql->bind_param("is", $id, $correo);
                    $sql->execute();

                    $result = $sql->get_result();

                    header('Content-Type: application/json; charset=utf-8');

                    if ($result) {
                        echo json_encode(array('SUCCESS' => 'La subactividad ha sido eliminada con exito'));
                    } else {
                        throw new Exception('No se elimino el registro');
                    }
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }



    public function actualizarsubactividad($id, $dato, $correo)
    {


              
        if (!isset($id) || !isset($correo)) {
            $res = array(["error" => "El id y el correo son obligatorios."]);
            echo json_encode($res);
            exit;
        }

        $conexion = new conexion();
        $sql = $conexion->test()->prepare("select correo from usuario where correo = ?");

        $sql->bind_param("s", $correo);
        $sql->execute();

        $result = $sql->get_result();

        $row = $result->fetch_assoc();


        try {
            if (isset($row['correo']) == null) { //si el correo ingresado no existe, arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {

                $nombre = $dato['nombre'];
                $id_usuario = $dato['id_usuario'];
                $id_actividad = $dato['id_actividad'];
                $fechaInicio = $dato['fechaInicio'];
                $fechaFin = $dato['fechaFin'];
                $estado = $dato['estado'];


                $sql = $conexion->test()->prepare("call sp_subActividad('actualizar', ?, ?, ?, ?, ?, ?, ?, ?)");

                $sql->bind_param('isiissis', $id, $nombre, $id_usuario, $id_actividad, $fechaInicio, $fechaFin, $estado, $correo);

                $sql->execute();

                $resultado = $sql->get_result();


                header('Content-Type: application/json; charset=utf-8');


                if ($resultado) {
                    echo json_encode(array('mensaje' => 'Subactividad actualizada'));
                } else {
                    throw new Exception('No se pudo actualizar el registro');
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }
}
