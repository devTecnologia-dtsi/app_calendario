<?php

include_once __DIR__ . "/../../config/dbCalendario.php";

class crudactividad {

    public function consultaractividad($conexion, $id){

        $sql = ($id==null) ? "call calendarios.sp_actividad('ver', null, 'null', 'null', null);" : "call calendarios.sp_actividad('ver', '$id', 'null', 'null', null);" ;

        $resultado = $conexion->query($sql);

    
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
        
        $anio = isset($dato['anio']) ? $dato['anio'] : null;
        $periocidad = isset($dato['periocidad']) ? $dato['periocidad'] : null;
        $modalidad = isset($dato['modalidad']) ? $dato['modalidad'] : null;
        $sede_id = isset($dato['sede_id']) ? $dato['sede_id'] : null;  
       
        $sql = "call sp_periodo('insertar', null, '$anio', '$periocidad', '$modalidad', '$sede_id')";
        $resultado= $conexion->query($sql);
       
    
        if($resultado){
            $dato['id'] = $conexion -> insert_id;
            echo json_encode($dato);
    
        }else{
            echo json_encode(array('error'=>'Error en la insercion de datos'));
        }
    
    }
    
    public function eliminaractividad($conexion, $id){
      
        $sql = "call calendarios.sp_periodo('eliminar', $id, null, null, null, null)";
        $resultado= $conexion->query($sql);
    
        if($resultado){ 
            echo json_encode(array('mensaje'=>'periodo eliminado'));
    
        }else{
            echo json_encode(array('error'=>'No se elimino el registro'));
        }
    }

    
    public function actualizaractividad($conexion, $id, $dato){
        $id = $dato['id'];
        $anio = $dato['anio'];
        $periocidad = $dato['periocidad'];
        $modalidad = $dato['modalidad'];
        $sede_id = $dato['sede_id'];
    
        echo "El id a editar es ".$id. "con los datos".$anio. ", " .$periocidad. ", " .$modalidad. ", " .$sede_id;

        $sql = "call sp_periodo('actualizar', '$id' , '$anio', '$periocidad', '$modalidad', '$sede_id')";
        

        $resultado= $conexion->query($sql);
        if($resultado){
            echo json_encode(array('mensaje'=>'Periodo actualizado'));
    
        }else{
            echo json_encode(array('error'=>'No se pudo actualizar el registro'));
        }
    
    }
    

}

?>