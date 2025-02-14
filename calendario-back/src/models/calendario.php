<?php

include_once __DIR__ . "/../../config/conexion.php";


//hay que hacer que el parametro correo del sp del query sea dinamico conectandolo con el registro de la tabla usuario
class crudcalendario
{


    public function consultarcalendario($id, $correo)
    {

        // $correo = 'maria1265.edu'; //el correo debe pedirse como una variable dinamica

        if (isset($correo)) {
            $res = array(["error" => "El correo es obligatorio."]);
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
            if (isset($row['correo']) == null) { //si el correo ingresado, no existe arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {

                if ($id == null) {

                    $sql = $conexion->test()->prepare("call calendarios.sp_calendario('ver', null, null, null, null, null, null, NOW(), null, null, ? );");
                    $sql->bind_param("s", $correo);
                } else {

                    $sql = $conexion->test()->prepare("call calendarios.sp_calendario('ver', ? , null, null, null, null, null, NOW(), null, null, ?);");
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

    public function insertarcalendario($dato, $correo)
    {

        try {

            
        if (isset($correo)) {
            $res = array(["error" => "El correo es obligatorio."]);
            echo json_encode($res);
            exit;
        }

        $conexion = new conexion;

        $sql = $conexion->test()->prepare("select correo from usuario where correo = ?");

        $sql->bind_param("s", $correo);
        $sql->execute();

        $result = $sql->get_result();

        $row = $result->fetch_assoc();


       
            if (isset($row['correo']) == null) { //si el correo ingresado no existe, arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {

                $id_usuario = isset($dato['id_usuario']) ? $dato['id_usuario'] : null;
                $id_rectoria = isset($dato['id_rectoria']) ? $dato['id_rectoria'] : null;
                $id_sede = isset($dato['id_sede']) ? $dato['id_sede'] : null;
                $id_tipoCalendario = isset($dato['id_tipoCalendario']) ? $dato['id_tipoCalendario'] : null;
                $estado = isset($dato['estado']) ? $dato['estado'] : null;
                $inSede = isset($dato['inSede']) ? $dato['inSede'] : null;
                $id_periodo = isset($dato['id_periodo']) ? $dato['id_periodo'] : null;

                $sql = $conexion->test()->prepare("call sp_calendario('insertar', null, ? , ? , ? , ? , ?, NOW(), ? , ?, ?)");

                $sql->bind_param("iiiiiiis", $id_usuario, $id_rectoria, $id_sede, $id_tipoCalendario, $estado, $inSede, $id_periodo, $correo);

                $sql->execute();

                $resultado =  $sql->get_result();
               

                header('Content-Type: application/json; charset=utf-8');

                //toma el id del autoincremental del sp
                if ($resultado) { //arreglar validacion
                    echo json_encode(array('Mensaje' => 'Se ha ingresado un calendario con exito'));
                } else {
                    throw new Exception('Error en la insercion de datos');
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }


    public function eliminarcalendario($id, $correo)
    {

        try {

            
        if (!isset($id) || !isset($correo)) {
            $res = array(["error" => "El id y el correo son obligatorios."]);
            echo json_encode($res);
            exit;
        }

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
            } else {

                if ($id == null) { //si no hay id en la url de postman dara el siguiente error
                    throw new Exception('No ha ingresado el id del calendario a eliminar');
                }

                $sqlid = $conexion->test()->prepare("select id from calendario where id = ? ;");
    

                $sqlid->bind_param("i", $id);
                $sqlid->execute();

                $result = $sqlid->get_result();

                $idregistrado = $result->fetch_assoc();
                
                $idverificado = isset($idregistrado['id']) ? $idregistrado['id'] : null;
            }

            if ($idverificado == null) { //si el id usado ya fue borrado una primera vez o todavia no tiene un registro asignado, arroja este error
                throw new Exception('El registro de este id ya ha sido borrado o no ha sido creado');
            } else {
                if (isset($row['correo']) == null) { //si el correo ingresado no existe, arroja este error
                    throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
                } else {

                    $sqlestado = $conexion->test()->prepare("select estado from calendario where id = ?;");

                    $sqlestado->bind_param("i", $id);
                    $sqlestado->execute();

                    $result = $sqlestado->get_result();

                    $estadoregistrado = $result->fetch_assoc();
                    $estadoverificado = $estadoregistrado['estado'];


                    if ($estadoverificado == 1) { // si su estado es uno no se puede eliminar ese registro

                        throw new Exception('No se puede eliminar el calendario porque se encuentra activo');
                    } else {

                        $sql = $conexion->test()->prepare("call sp_calendario('eliminar', ?, null, null, null, null, null, null, null, null, ?);");

                        $sql->bind_param('is', $id, $correo);

                        $sql->execute();

                        $result = $sql->get_result();

                        header('Content-Type: application/json; charset=utf-8');
                    

                        if ($result) {
                            echo json_encode(array('SUCCESS' => 'El calendario ha sido borrado con exito'));
                        } else {
                            throw new Exception('No se elimino el registro');
                        }
                    }
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }


    public function actualizarcalendario($id, $dato, $correo)
    {


        try {
        

            
        if (!isset($id) || !isset($correo)) {
            $res = array(["error" => "El id y el correo son obligatorios."]);
            echo json_encode($res);
            exit;
        }

        $conexion = new conexion;

        $sql = $conexion->test()->prepare("select correo from usuario where correo = ?");

        $sql->bind_param("s", $correo);
        $sql->execute();

        $result = $sql->get_result();

        $row = $result->fetch_assoc();

       
            if (isset($row['correo']) == null) { // Si el correo ingresado no existe, arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {
                $id = ($dato['id']);
                $id_usuario = isset($dato['id_usuario']) ? $dato['id_usuario'] : null;
                $id_rectoria = isset($dato['id_rectoria']) ? $dato['id_rectoria'] : null;
                $id_sede = isset($dato['id_sede']) ? $dato['id_sede'] : null;
                $id_tipoCalendario = isset($dato['id_tipoCalendario']) ? $dato['id_tipoCalendario'] : null;
                $estado = isset($dato['estado']) ? $dato['estado'] : null;
                $inSede = isset($dato['inSede']) ? $dato['inSede'] : null;
                $id_periodo = isset($dato['id_periodo']) ? $dato['id_periodo'] : null;

                $sql = $conexion->test()->prepare("call sp_calendario('actualizar', ? , ?, ? , ? , ? , ?, now(), ? , ? , ?)");

                $sql->bind_param("iiiiiiiis", $id, $id_usuario, $id_rectoria, $id_sede, $id_tipoCalendario, $estado, $inSede, $id_periodo, $correo);

                $sql->execute();

                $resultado =  $sql->get_result();

                header('Content-Type: application/json; charset=utf-8');

                // Si resultado es igual a 1 dirá que el calendario se actualizó
                if ($resultado) {
                    echo json_encode(array('mensaje' => 'Se ha actualizado el calendario con exito'));
                } else {
                    throw new Exception('Error en la insercion de datos');
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }
}
