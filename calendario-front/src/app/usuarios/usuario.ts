// Creación
export interface UsuarioCreacionDTO {
    correo_nuevo: string;
    estado: number;
    id_rectoria: number;
    id_sede: number;
    fechaIngreso: Date;
    fechaCreacion: Date;
    id_rol: number;
  }
  
  // Lectura
  export interface UsuarioDTO {
    id: number;
    correo_nuevo: string;
    estado: 1;
    id_rectoria: number;
    id_sede: number;
    fechaIngreso: Date;
    fechaCreacion: Date;
    id_rol: number;
  }
  
  // Respuesta de la API
  export interface RespuestaAPI {
    status: number;
    message: string;
    data: UsuarioDTO | null;
    total: number;
  }
  