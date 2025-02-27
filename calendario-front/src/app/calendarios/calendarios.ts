export interface CalendarioDTO {
    id: number;
    id_usuario: number;
    id_rectoria: number;
    id_sede: number;
    id_tipoCalendario: number;
    estado: number;
    fecha_creacion: Date;
    in_sede: number;
    id_periodo: number;
    actividades?: ActividadDTO[];
}

export interface CalendarioCreacionDTO {
    id_rectoria: number;
    id_sede: number;
    id_tipoCalendario: number;
    estado: number;
    fecha_creacion: Date;
    in_sede: number;
    id_periodo: number;
    actividades?: ActividadCreacionDTO[];
}

export interface ActividadDTO {
    id: number;
    nombre: string;
    estado: number;
    fecha_creacion: Date;
    subactividades?: SubActividadDTO[];
}

export interface ActividadCreacionDTO {
    nombre: string;
    estado: number;
    fecha_creacion: Date;
    subactividades?: SubActividadCreacionDTO[];
}

export interface SubActividadDTO {
    id: number;
    nombre: string;
    estado: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    fecha_creacion: Date;
}

export interface SubActividadCreacionDTO {
    nombre: string;
    estado: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    fecha_creacion: Date;
}
