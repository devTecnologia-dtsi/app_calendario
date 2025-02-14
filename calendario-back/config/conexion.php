<?php
//comenzamos declarando el nombre de la clse
class conexion
{
    //creamos los atributos de la clase
    private $server  = "10.0.20.189";
    private $user = "root";
    private $password = "Jailton81*";
    private $database = "calendarios";
    private $port = "3306";
    public $conexion;

    public function test()
    {
        return $this->conexion;
    }


    //declaramos el contructor 
    function __construct()
    {

        try {
            $this->conexion = new mysqli($this->server, $this->user, $this->password, $this->database, $this->port);
            $this->conexion->set_charset('utf8mb4');
            if ($this->conexion->connect_error) {
                throw new Exception();
                die();
            }
        } catch (Exception $e) {
            echo json_encode(array('ERROR' => $e->getMessage()));
            // echo$e->getMessage();
            exit;
        }
    }

    //esta funcion se invoca para hacer peticiones get
    public function obtenerDatos($query)
    {
        $resultado = $this->conexion->query($query);  // Ejecuta la consulta SQL
        if ($resultado) {

            return $resultado;  // Retorna el objeto mysqli_result
        } else {
            return false;  // Retorna false si hay un error en la consulta
        }

    }

    //esta funcion la invocaremos cuando necesitemos utilizar peticiones post,put,delete
    public function afectarDatos($sqlstr)
    {
        $this->conexion->query($sqlstr);
        return $this->conexion->affected_rows; //retorna  las columnas que van a ser afectadas por la consulta

    }
}
