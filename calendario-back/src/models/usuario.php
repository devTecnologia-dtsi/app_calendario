<?php

include_once __DIR__ . "/../../config/conexion.php";

//este modelo es solo para el superadmin
class crudusuario
{

    public function consultarusuario($id, $correo)
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

            $usuario = new crudusuario();
            $perfil = $usuario->consultarrolusuario($correo);

            // var_dump($perfil);

        

            if ($perfil[0]['nombre'] != "admin") { //si el rol del correo tiene un nombre diferente de admin, saldra este error
                // var_dump($perfil[0]['borrar']);
                throw new Exception('Acceso denegado, por favor contacte con el administrador de la aplicacion');
            }


            if (isset($row['correo']) == null) { //si el correo ingresado, no existe arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            } else {

                if ($id == null) {
                    $sql = $conexion->test()->prepare("call calendarios.sp_usuario('VER', null, ?, null, null, null, null, now(), null);");
                    $sql->bind_param('s', $correo);
                } else {
                    $sql = $conexion->test()->prepare("call calendarios.sp_usuario('VER', ?, ?, null, null, null, null, now(), null);");
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

    public function consultarrolusuario($correo)
    {
        // bWNpaGVsbGV0b2JhdEB1bmltaS5lZHU correo admin
        // bWFyaWExMjZAdW5pbWkuZWR1 correo normal


        try {


            $conexion = new conexion();


            $sql =  $conexion->test()->prepare("call calendarios.sp_getRolByUser('CONSULTAR', ?);");
            $sql->bind_param('s', $correo);

            $sql->execute();

            $resultado = $sql->get_result();
            
            if ($resultado) {
                $datos = array(); //mete los datos de cada registro de la base de datos en un arreglo

                while ($fila = $resultado->fetch_assoc()) { //guarda los datos usando un bucle while y recorriendo el arreglo con fetch_assoc
                    $datos[] = $fila;
                }
                header('Content-Type: application/json; charset=utf-8');
                // echo json_encode($datos); //hacer una condicion para mostrar todo el json para cuando se llame por parametro a rol_usuario

            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }

        return $datos;
        

    }

    public function insertarusuario($dato, $correo)
    {

        try {
            // bWNpaGVsbGV0b2JhdEB1bmltaS5lZHU correo admin
            // bWFyaWExMjZAdW5pbWkuZWR1 correo normal


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

            $usuario = new crudusuario();
            $perfil = $usuario->consultarrolusuario($correo);

            var_dump($perfil);

            if ($row['correo'] == null) { //si el correo ingresado no existe, arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            }

            if ($perfil[0]['nombre'] != 'admin') { //si el correo no tiene permisos para borrar(no es del admin) saldra este error
                // var_dump($perfil[0]['borrar']);
                throw new Exception('Acceso denegado, por favor contacte con el administrador de la aplicacion');
            } else {

                $correonuevo = isset($dato['correo']) ? $dato['correo'] : null;
                $estado = isset($dato['estado']) ? $dato['estado'] : null;
                $id_sede = isset($dato['id_sede']) ? $dato['id_sede'] : null;
                $id_rectoria = isset($dato['id_sede']) ? $dato['id_sede'] : null;
                $fechaIngreso = isset($dato['fechaIngreso']) ? $dato['fechaIngreso'] : null;
                $id_rol = isset($dato['id_rol']) ? $dato['id_rol'] : null;

                $sql = $conexion->test()->prepare("call sp_usuario('insertar', null, ? , ? , ? , ? , ? , ?, ?)");

                $sql->bind_param('ssiiisi', $correo ,$correonuevo, $estado , $id_sede, $id_rectoria, $fechaIngreso, $id_rol);

                $sql->execute();

                $resultado = $sql->get_result();

                header('Content-Type: application/json; charset=utf-8');


                if ($resultado) {
                    echo json_encode(array('mensaje' => 'Nuevo usuario registrado'));
                } else {
                    throw new Exception('Error en la insercion de datos');
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function actualizarusuario($dato, $id, $correo) {

        try {
            // bWNpaGVsbGV0b2JhdEB1bmltaS5lZHU correo admin
            // bWFyaWExMjZAdW5pbWkuZWR1 correo normal


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

           

            if ($row['correo'] == null) { //si el correo ingresado no existe, arroja este error
                throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
            }

            if ($perfil[0]['nombre'] != 'admin') { //si el correo no tiene permisos para borrar(no es del admin) saldra este error
                // var_dump($perfil[0]['borrar']);
                throw new Exception('Acceso denegado, por favor contacte con el administrador de la aplicacion');
            } else {

                // $id = $dato['id'];
                $correonuevo = isset($dato['correo']) ? $dato['correo'] : null;
                $estado = isset($dato['estado']) ? $dato['estado'] : null;
                $id_sede = isset($dato['id_sede']) ? $dato['id_sede'] : null;
                $id_rectoria = isset($dato['id_sede']) ? $dato['id_sede'] : null;
                $fechaIngreso = isset($dato['fechaIngreso']) ? $dato['fechaIngreso'] : null;
                $id_rol = isset($dato['id_rol']) ? $dato['id_rol'] : null;

                $sql = $conexion->test()->prepare("call sp_usuario('actualizar', ?, ? , ? , ? , ? , ? , ?, ?)");

               

                $sql->bind_param('issiiisi', $id ,$correo ,$correonuevo, $estado , $id_sede, $id_rectoria, $fechaIngreso, $id_rol);

                $sql->execute();

                $resultado = $sql->get_result();

                header('Content-Type: application/json; charset=utf-8');


                if ($resultado) {
                    echo json_encode(array('mensaje' => 'Se ha actualizado el usuario con exito'));
                } else {
                    throw new Exception('Error en la insercion de datos');
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }

    public function eliminarusuario($id, $correo) {

        

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
                throw new Exception('No ha ingresado el id del usuario a eliminar');
            }
            
           
            if ($perfil[0]['nombre'] != 'admin') { //si el correo no tiene permisos para borrar(no es del admin) saldra este error
                // var_dump($perfil[0]['borrar']);
                throw new Exception('Usted no tiene permiso para borrar este registro, por favor contacte con el administrador de la aplicacion');
            }


            $sqlid = $conexion->test()->prepare("select id from usuario where id = ? ;");

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
                    $sqlestado = $conexion->test()->prepare("select estado from usuario where id = ?;");

                    $sqlestado->bind_param("i", $id);
                    $sqlestado->execute();

                    $result = $sqlestado->get_result();

                    $estadoregistrado = $result->fetch_assoc();
                    $estadoverificado = $estadoregistrado['estado'];

                    if ($estadoverificado == 1) { // si su estado es uno no se puede eliminar ese registro

                        throw new Exception('No se puede eliminar el usuario porque se encuentra activo');
                    }

                    $sql = $conexion->test()->prepare("call sp_usuario('eliminar', ?, ?, null, null, null, null, null, null);");

                    $sql->bind_param("is", $id, $correo);
                    $sql->execute();

                    $result = $sql->get_result();

                    header('Content-Type: application/json; charset=utf-8');

                    if ($result) {
                        echo json_encode(array('SUCCESS' => 'El usuario ha sido eliminado con exito'));
                    } else {
                        throw new Exception('No se elimino el registro');
                    }
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
        }
    }
}
