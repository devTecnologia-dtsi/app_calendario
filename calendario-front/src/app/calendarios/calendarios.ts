export interface CalendarioDTO {
    id_calendario: number;
    correo_organizador: string;
    tipo_calendario: string;
    rectoria: string;
    sede: string;
    modalidad: string;
    periodo_academico: string;
    en_sede: string;
    estado_calendario: string;
    fecha_creacion: Date;
}

export interface CalendarioCreacionDTO {
    id_usuario: number;
    id_rectoria: number;
    id_sede: number;
    id_tipo_calendario: number;
    id_modalidad: number;
    estado: number;
    en_sede: number;
    id_periodo_academico: number;
    id_tipo_periodo: number;
    actividades?: ActividadCreacionDTO[];
}

export interface RespuestaCreacionCalendario {
    status: number;
    message: string;
    id_calendario: number;
}

export interface CalendarioRespuestaAPI {
    status: number;
    message: string;
    data: RespuestaCreacionCalendario;
}

// Actividades
export interface ActividadDTO {
    id: number;
    id_calendario: number;
    titulo: string;
    estado: number;
}

export interface ActividadCreacionDTO {
    id_calendario?: number;
    titulo: string;
    estado: number;
    subactividades?: SubactividadCreacionDTO[];
}

export interface RespuestaCreacionActividad {
    status: number;
    message: string;
    id_actividad: number;
}

export interface RespuestaAPIActividades {
    status: number;
    message: string;
    data: RespuestaCreacionActividad;
}

// Subactividades
export interface SubactividadDTO {
    id: number;
    id_actividad: number;
    nombre: string;
    descripcion: string;
    estado: number;
    fecha_inicio: Date;
    fecha_fin: Date;
}

export interface SubactividadCreacionDTO {
    id_actividad?: number;
    nombre: string;
    descripcion: string;
    estado: number;
    fecha_inicio: Date;
    fecha_fin: Date;
}

export interface RespuestaAPISubactividades {
    status: number;
    message: string;
    data: SubactividadDTO;
}

// Modalidades
export interface ModalidadDTO {
    id: number;
    nombre: string;
    estado: number;
    id_rectoria: number;
}

export interface ModalidadCreacionDTO {
    nombre: string;
    estado: number;
    id_rectoria: number;
}

export interface RespuestaAPIModalidad {
    status: number;
    message: string;
    data: ModalidadDTO[];
}

// Periodos
export interface PeriodoDTO {
    id: number;
    anio: number;
    periodo: number;
    estado: number;
}

export interface PeriodoCreacionDTO {
    anio: number;
    periodo: number;
    estado: number;
}

export interface RespuestaAPIPeriodo {
    status: number;
    message: string;
    data: PeriodoDTO[];
}

// Tipos de calendario
export interface TipoCalendarioDTO {
    id: number;
    nombre: string;
}

export interface RespuestaAPITipoCalendario {
    status: number;
    message: string;
    data: TipoCalendarioDTO[];
}
