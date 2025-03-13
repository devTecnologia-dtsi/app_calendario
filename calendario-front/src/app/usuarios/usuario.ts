//Creación
export interface UsuarioCreacionDTO {
    correo: string;
    estado: number;
    id_rectoria: number;
    id_sede: number;
    fecha_ingreso: Date;
    fecha_creacion: Date;
    id_rol: number;
}

//Lectura
export interface UsuarioDTO{
    id: number;
    correo: string;
    estado: 1;
    id_rectoria: number;
    id_sede: number;
    fecha_ingreso: Date;
    fecha_creacion: Date;
    id_rol: number;
}

export interface RespuestaAPI {
    mensaje: string;
  }
  
