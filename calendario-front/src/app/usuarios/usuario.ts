export interface PermisoUsuario {
  id_permiso?: number;
  id_rectoria: number;
  nombre_rectoria?: string;
  id_sede: number;
  nombre_sede?: string;
  id_rol: number;
  nombre_rol?: string;
}

export interface UsuarioDTO {
  id_usuario: number;
  correo: string;
  estado: number;
  fecha_creacion: string;
  permisos?: Array<{
    id_permiso?: number;
    id_rectoria: number;
    nombre_rectoria: string;
    id_sede: number;
    nombre_sede: string;
    id_rol: number;
    nombre_rol: string;
  }>;
}

export interface UsuarioCreacionDTO {
  correo: string;
  estado: number;
  permisos: PermisoUsuario[];
}

export interface RespuestaAPI {
  status: number;
  message: string;
  total?: number;
  data: any;
}
