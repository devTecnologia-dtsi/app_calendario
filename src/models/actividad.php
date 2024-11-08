<?php

include_once __DIR__ . "/../../config/conexion.php";


class crudactividad {

    public function consultaractividad($id){

        $sql = ($id==null) ? "call calendarios.sp_actividad('ver', null, 'null', 'null', null);" : "call calendarios.sp_actividad('ver', '$id', 'null', 'null', null);" ;


        $conexion = new conexion;

        $resultado = $conexion->obtenerDatos($sql);
    
        if($resultado){
        $datos = array();
        
        while($fila= $resultado ->fetch_assoc()){
            $datos[]= $fila;        
            
        }
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($datos);
    
        }
    }
    
    public function insertaractividad($conexion, $dato){
        
        $id_calendario = isset($dato['id_calendario']) ? $dato['id_calendario'] : null;
        $nombre = isset($dato['nombre']) ? $dato['nombre'] : null;
        $estado = isset($dato['estado']) ? $dato['estado'] : null;
       

        
        $sql = "call sp_actividad('insertar', null, '$id_calendario', '$nombre', '$estado');";
        $resultado= $conexion->query($sql);
       
        
    
        if($resultado){
            $dato['id'] = $conexion -> getInsertId();
            echo json_encode($dato);
    
        }else{
            echo json_encode(array('exito'=>'dato insertado correctamente'));
        }
    
    }
    
    public function eliminaractividad($id){
    

        $conexion = new conexion;
      
        $sql = "call calendarios.sp_actividad('eliminar', $id, 'null', 'null', null);";
        $resultado= $conexion->nonQuery($sql);
    
        if($resultado){ 
            echo json_encode(array('mensaje'=>'actividad eliminada'));
    
        }else{
            echo json_encode(array('error'=>'No se elimino el registro'));
        }
    }

    
    public function actualizaractividad($id, $dato){

        $conexion = new conexion;
        $id = $dato['id'];
        $id_calendario = $dato['id_calendario'];
        $nombre = $dato['nombre'];
        $estado = $dato['estado'];
       
    
        echo "El id a editar es ".$id. "con los datos".$id_calendario. ", " .$nombre. ", " .$estado;

        $sql = "call sp_actividad('actualizar', '$id' , '$id_calendario', '$nombre', '$estado')";
        //call calendarios.sp_actividad('actualizar', 13, '1', 'actividadedit', 1);

        $resultado= $conexion->nonQuery($sql);
        if($resultado){
            echo json_encode(array('mensaje'=>'Periodo actualizado'));
    
        }else{
            echo json_encode(array('error'=>'No se pudo actualizar el registro'));
        }
    
    }
    

}

?>