<?php

include_once __DIR__ . "/../../config/conexion.php";


class crudperiodo
{

    public function consultarperiodo($id, $correo)
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

        

            if (isset($row['correo']) == null) { //si el correo ingresado, no existe en la bd arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {

                if ($id == null) {

                    $sql = $conexion->test()->prepare("call calendarios.sp_periodo('ver', null,  null, null, null, null, ? )");
                    $sql->bind_param("s", $correo);
                } else {

                    $sql = $conexion->test()->prepare("call calendarios.sp_periodo('ver', ? ,  null, null, null, null, ? );");
                    $sql->bind_param("is", $id, $correo);
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

    public function insertarperiodo($dato, $correo)
    {


        if (!isset($correo)) {
            $res = array(["error" => " el correo es obligatorio"]);
            echo json_encode($res);
            exit;
        }
       

        $conexion = new conexion;

        $sql = $conexion->test()->prepare("select correo from usuario where correo = ?");

        $sql->bind_param("s", $correo);
        $sql->execute();

        $result = $sql->get_result();

        $row = $result->fetch_assoc();


        try {
            if (isset($row) == null) { //si el correo ingresado no existe, arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {


                $anio = isset($dato['anio']) ? $dato['anio'] : null;
                $periocidad = isset($dato['periocidad']) ? $dato['periocidad'] : null;
                $modalidad = isset($dato['modalidad']) ? $dato['modalidad'] : null;
                $sede_id = isset($dato['sede_id']) ? $dato['sede_id'] : null;

                $sql = $conexion->test()->prepare("call sp_periodo('insertar', null, '$anio', '$periocidad', '$modalidad', '$sede_id', now(),'$correo')");

                $sql->bind_param("issis", $anio, $periocidad, $modalidad, $sede_id, $correo);
                $sql->execute();

                $resultado =  $sql->get_result();

                header('Content-Type: application/json; charset=utf-8');

                //toma el id del autoincremental del sp
                if ($resultado) {
                    echo json_encode(array('mensaje' => 'Nuevo periodo insertado'));
                } else {
                    throw new Exception('Error en la insercion de datos');
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function eliminarperiodo($id, $correo)
    {


       // bWNpaGVsbGV0b2JhdEB1bmltaS5lZHU correo admin
       // bWFyaWExMjZAdW5pbWkuZWR1 correo normal


        if (!isset($id) || !isset($correo)) {
            $res = array(["error" => "El id y el correo son obligatorios."]);
            echo json_encode($res);
            exit;
        }
        try {
            $conexion = new conexion;
            $sql = $conexion->test()->prepare("select correo from usuario where correo = ?");
            $sql->bind_param("s", $correo);
            $sql->execute();
            $result = $sql->get_result();
            $row = $result->fetch_assoc();
            $usuario = new crudusuario();
            $perfil = $usuario->consultarrolusuario($correo);

            if ($perfil[0]['borrar'] != 1) { //si el correo no tiene permisos para borrar(no es del admin) saldra este error
                // var_dump($perfil[0]['borrar']);
                throw new Exception('Usted no tiene permiso para borrar este registro, por favor contacte con el administrador de la aplicacion');
                exit;
            }


            if (isset($row['correo']) == null) { //si no hay id en la url de postman dara el siguiente error
                throw new Exception('No ha ingresado el id del periodo a eliminar');
            }
            $sqlid = $conexion->test()->prepare("select id from periodo where id = ? ;");
            $sqlid->bind_param('i', $id);
            $sqlid->execute();
            $result = $sqlid->get_result();
            $idregistrado = $result->fetch_assoc();
            $idverificado = isset($idregistrado['id']) ? $idregistrado['id'] : null;

            if ($idverificado == null) {
                throw new Exception('El registro de este id ya ha sido borrado o no ha sido creado');
                exit;
            } else {
                if ($correo == 0) { //si el correo ingresado no existe, arroja este error
                    throw new Exception('El usuario con el correo ' . $correo . ' no esta registrado.');
                    exit;
                } else {


                    $sql = $conexion->test()->prepare("call calendarios.sp_periodo('eliminar', ?, null, null, null, null, ?)");

                    $sql->bind_param('is', $id, $correo);

                    $sql->execute();

                    $resultado = $sql->get_result();

                    header('Content-Type: application/json; charset=utf-8');


                    if ($resultado) {
                        echo json_encode(array('SUCCESS' => 'El periodo ha sido eliminado con exito'));
                    } else {
                        throw new Exception('No se elimino el registro');
                    }
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }







    public function actualizarperiodo($id, $dato, $correo) //se puede mandar el id por el endpoint o como variable post en el body
    {
        try {

            
        if (!isset($correo)) {
            $res = array(["error" => " el correo es obligatorio"]);
            echo json_encode($res);
            exit;
        }

            $conexion = new conexion;

            $sql = $conexion->test()->prepare("select correo from usuario where correo = ?");

            $sql->bind_param("s", $correo);
            $sql->execute();

            $result = $sql->get_result();

            $row = $result->fetch_assoc();

            header('Content-Type: application/json; charset=utf-8');
            if (isset($row['correo']) == null) { // Si el correo ingresado no existe, arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
                exit;

            } else {


                $id = isset($dato['id']) ? $dato['id'] : null;
                $anio = isset($dato['anio']) ? $dato['anio'] : null;
                $periocidad = isset($dato['periocidad']) ? $dato['periocidad'] : null;
                $modalidad = isset($dato['modalidad']) ? $dato['modalidad'] : null;
                $sede_id = isset($dato['sede_id']) ? $dato['sede_id'] : null;


                $sql = $conexion->test()->prepare("call sp_periodo('actualizar', ?, ? , ? , ?, ?, ?)");

                $sql->bind_param("iissis", $id, $anio, $periocidad, $modalidad, $sede_id, $correo);

                $sql->execute();

                $resultado =  $sql->get_result();

                header('Content-Type: application/json; charset=utf-8');



                if ($resultado) {
                    echo json_encode(array('mensaje' => 'Periodo actualizado'));
                } else {
                    throw new Exception('No se pudo actualizar el registro');
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }
}
