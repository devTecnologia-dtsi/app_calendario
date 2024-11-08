<?php
//comenzamos declarando el nombre de la clse
class conexion {
    //creamos los atributos de la clase
    private $server  = "10.0.20.189";
    private $user = "root";
    private $password = "Jailton81*";
    private $database = "calendarios";
    private $port = "3306";
    private $conexion;

    //declaramos el contructor 
    function __construct(){
        //obtenemos los datos del archivo config mediente el metodo datosConexion
        $this->conexion = new mysqli($this->server,$this->user,$this->password,$this->database,$this->port);
        if($this->conexion->connect_errno){
            echo "algo va mal con la conexion";
            die();
        }

    }
    

    
    public function obtenerDatos($query) {
        $resultado = $this->conexion->query($query);  // Ejecuta la consulta SQL
        if ($resultado) {
            return $resultado;  // Retorna el objeto mysqli_result
        } else {
            return false;  // Retorna false si hay un error en la consulta
        }
    }

    //esta funcion la invocaremos cuando necesitemos utilizar insert,delete,update
    public function nonQuery($sqlstr){
        $resultado = $this->conexion->query($sqlstr);
        return $this->conexion->affected_rows;
    }


    //UNICAMENTE INSERT YA QUE NOS DEVOLVERA EL ULTIMO ID INSERTADO 
    public function nonQueryID($sqlstr){
        $resultado = $this->conexion->query($sqlstr);
         $filas = $this->conexion->affected_rows;
         if($filas >= 1){
            return $this->conexion->insert_id;
         }else{
             return 0;
         }
    }

     
    //encriptar CONTRASEÑAS

    protected function encriptar($string){
        return md5($string);
    }

}


?> 