<?php

include_once __DIR__ . "/../../config/conexion.php";
include_once __DIR__ . "/../../config/cors.php";

class Actividad
{
    // Método para ejecutar el SP
    private function ejecutarSp($query, $params = [])
    {
        $conexion = new conexion();
        $sql = $conexion->test()->prepare($query);

        if (!empty($params)) {
            $sql->bind_param(...$params);
        }

        $sql->execute();
        $result = $sql->get_result();
        $sql->close();

        return $result;
    }

    // Método para responder JSON
    private function responderJson($respuesta)
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($respuesta);
        exit;
    }

    // Método para llamar al SP con diferentes acciones
    public function gestionarActividad($accion, $dato)
    {
        try {
            $query = "CALL sp_actividad(?, ?, ?, ?, ?, ?)";

            $id = isset($dato['id']) ? $dato['id'] : null;
            $id_calendario = isset($dato['id_calendario']) ? $dato['id_calendario'] : null;
            $nombre = isset($dato['nombre']) ? $dato['nombre'] : null;
            $estado = isset($dato['estado']) ? $dato['estado'] : null;
            $correo = isset($dato['correo']) ? $dato['correo'] : null;

            // Ejecuta el SP con los parámetros adecuados
            $result = $this->ejecutarSp($query, 
            ["sissis", $accion, $id, $id_calendario, $nombre, $estado, $correo]);

            // Procesa el resultado
            if ($accion === 'ver') {
                $actividades = $result->fetch_all(MYSQLI_ASSOC);
                $this->responderJson([
                    'status' => 1,
                    'message' => 'Actividades listadas correctamente',
                    'data' => $actividades
                ]);
            } else {
                $mensaje = $result->fetch_assoc();
                $this->responderJson([
                    'status' => $mensaje['status'],
                    'message' => $mensaje['message']
                ]);
            }
        } catch (Exception $e) {
            $this->responderJson([
                'status' => 0,
                'message' => 'Error al gestionar la actividad: ' . $e->getMessage()
            ]);
        }
    }

}




// class crudactividad
// {
//     public function consultaractividad($id, $correo)
//     {
//         try {

//             if (!isset($correo)) {
//                 $res = array(["error" => "El correo es obligatorio."]);
//                 echo json_encode($res);
//                 exit;
//             }

//             $conexion = new conexion();
//             $sql = $conexion->test()->prepare("select correo from usuario where correo = ?");

//             $sql->bind_param("s", $correo);
//             $sql->execute();

//             $result = $sql->get_result();

//             $row = $result->fetch_assoc();


//             if (isset($row['correo']) == null) { //si el correo ingresado, no existe arroja este error
//                 throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
//             } else {
//                 if ($id == null) {
//                     $sql =  $conexion->test()->prepare("CALL sp_actividad('ver', null, null ,null, null, ?);");
//                     $sql->bind_param("s", $correo);
//                 } else {

//                     $sql = $conexion->test()->prepare("CALL sp_actividad('ver', ? , null ,null, null, ? );");
//                     $sql->bind_param("is", $id, $correo);
//                 }

//                 $sql->execute();

//                 $resultado =  $sql->get_result();


//                 if ($resultado) {
//                     $datos = array(); //mete los datos de cada registro de la base de datos en un arreglo

//                     while ($fila = $resultado->fetch_assoc()) { //guarda los datos usando un bucle while y recorriendo el arreglo con fetch_assoc
//                         $datos[] = $fila;
//                     }
//                     header('Content-Type: application/json; charset=utf-8');
//                     echo json_encode($datos);
//                 }
//             }
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }

//     public function insertaractividad($dato, $correo)
//     {

//         //usar rolusuario para validar los permisos del correo y determinar si es el superadmin o no

//         try {

//             if (!isset($correo)) {
//                 $res = array(["error" => "El correo es obligatorio."]);
//                 echo json_encode($res);
//                 exit;
//             }

//             $conexion = new conexion();
//             $sql = $conexion->test()->prepare("select correo from usuario where correo = ?");

//             $sql->bind_param("s", $correo);
//             $sql->execute();

//             $result = $sql->get_result();

//             $row = $result->fetch_assoc();


//             if (isset($row['correo']) == null) { //si el correo ingresado, no existe arroja este error
//                 throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
//             } else {


//                 $id_calendario = isset($dato['id_calendario']) ? $dato['id_calendario'] : null;
//                 $nombre = isset($dato['nombre']) ? $dato['nombre'] : null;
//                 $estado = isset($dato['estado']) ? $dato['estado'] : null;

//                 $sql = $conexion->test()->prepare("call sp_actividad('insertar', null, ? , ? , ? , ? );");

//                 $sql->bind_param("isis", $id_calendario, $nombre, $estado, $correo);

//                 $sql->execute();

//                 $resultado =  $sql->get_result();

//                 header('Content-Type: application/json; charset=utf-8');

//                 //toma el id del autoincremental del sp
//                 if ($resultado) {
//                     echo json_encode(array('mensaje' => 'Nueva actividad insertada'));
//                 } else {
//                     throw new Exception('Error en la insercion de datos');
//                 }
//             }
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }

//     public function eliminaractividad($id, $correo)
//     {

//         // bWNpaGVsbGV0b2JhdEB1bmltaS5lZHU correo admin "mcihelletobat@unimi.edu";
//         // bWFyaWExMjZAdW5pbWkuZWR1 correo normal maria1265.edu'


//         try {

//             if (!isset($id) || !isset($correo)) {
//                 $res = array(["error" => "El id y el correo son obligatorios."]);
//                 echo json_encode($res);
//                 exit;
//             }


//             $conexion = new conexion;
//             $sql = $conexion->test()->prepare("select id_rol from usuario where correo = ?");

//             $sql->bind_param("s", $correo);
//             $sql->execute();

//             $result = $sql->get_result();

//             $row = $result->fetch_assoc();

//             // var_dump($row);


//             $usuario = new crudusuario();

//             $perfil = $usuario->consultarrolusuario($correo);


//             if ($perfil[0]['borrar'] != 1) { //si el correo no tiene permisos para borrar(no es del admin) saldra este error
//                 // var_dump($perfil[0]['borrar']);
//                 throw new Exception('Usted no tiene permiso para borrar este registro, por favor contacte con el administrador de la aplicacion');
//             } else {

//                 if ($id == null) { //si no hay id en la url de postman dara el siguiente error
//                     throw new Exception('No ha ingresado el id de la actividad a eliminar');
//                 }

//                 $sqlid = $conexion->test()->prepare("select id from actividad where id = ? ;");

//                 $sqlid->bind_param("i", $id);
//                 $sqlid->execute();

//                 $result = $sqlid->get_result();

//                 $idregistrado = $result->fetch_assoc();

//                 $idverificado = isset($idregistrado['id']) ? $idregistrado['id'] : null;

//                 if ($idverificado == null) { //si el id usado ya fue borrado una primera vez o todavia no tiene un registro asignado, arroja este error
//                     throw new Exception('El registro de este id ya ha sido borrado o no ha sido creado');
//                 } else {
//                     if (($row['correo']) == null) { //si el correo ingresado no existe, arroja este error
//                         throw new Exception('El usuario con el correo ' . $correo . ' no esta registrado.');
//                     } else {

//                         $sqlestado = $conexion->test()->prepare("select estado from actividad where id = ?;");

//                         $sqlestado->bind_param("i", $id);
//                         $sqlestado->execute();

//                         $result = $sqlestado->get_result();

//                         $estadoregistrado = $result->fetch_assoc();
//                         $estadoverificado = $estadoregistrado['estado'];

//                         if ($estadoverificado == 1) { // si su estado es uno no se puede eliminar ese registro

//                             throw new Exception('No se puede eliminar la actividad porque se encuentra activa');
//                         }

//                         $sql = $conexion->test()->prepare("CALL sp_actividad('eliminar', ?, null ,null, null, ? );");

//                         $sql->bind_param("is", $id, $correo);
//                         $sql->execute();

//                         $result = $sql->get_result();

//                         header('Content-Type: application/json; charset=utf-8');

//                         if ($result) {
//                             echo json_encode(array('mensaje' => 'Actividad eliminada'));
//                         } else {
//                             throw new Exception('No se elimino el registro');
//                         }
//                     }
//                 }
//             }
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }


//     public function actualizaractividad($id, $dato, $correo)
//     {
//         try {

//             if (!isset($id) || !isset($correo)) {
//                 $res = array(["error" => "El id y el correo son obligatorios."]);
//                 echo json_encode($res);
//                 exit;
//             }

//             $conexion = new conexion();
//             $sql = $conexion->test()->prepare("select correo from usuario where correo = ?");

//             $sql->bind_param("s", $correo);
//             $sql->execute();

//             $result = $sql->get_result();

//             $row = $result->fetch_assoc();


//             if (isset($row['correo']) == null) { //si el correo ingresado no existe, arroja este error
//                 throw new Exception('El usuario con el correo ' . $correo . ' no está registrado.');
//             } else {

//                 // $id = $dato['id']; //Importante: no borrar ni el parametro, ni la asignacion de id como dato id ya que el parametro siempre trae id nulo (ni idea del porque) y con la asignacion se sobreescribe al valor correspondiente de la peticion put
//                 $id_calendario = $dato['id_calendario'];
//                 $nombre = $dato['nombre'];
//                 $estado = $dato['estado'];


//                 $sql = $conexion->test()->prepare("call sp_actividad('actualizar', ? , ? , ? , ? , ?)");

//                 $sql->bind_param("iisis", $id, $id_calendario, $nombre, $estado, $correo);

//                 $sql->execute();

//                 $resultado =  $sql->get_result();

//                 header('Content-Type: application/json; charset=utf-8');


//                 if ($resultado) {
//                     echo json_encode(array('mensaje' => 'Actividad actualizada'));
//                 } else {
//                     throw new Exception('No se pudo actualizar el registro');
//                 }
//             }
//         } catch (Exception $e) {
//             echo json_encode(array('ERROR' => $e->getMessage()));
//         }
//     }
// }
