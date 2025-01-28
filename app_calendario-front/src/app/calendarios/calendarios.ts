export interface CalendarioDTO
{
    id : number;
    nombreActividad: string;
    estadoActividad: number;
    fechaEdicionActividad: Date;
    nombreSubActividad: string;
    estadoSubActividad: number;
    fechaInicio: Date;
    fechaFin?: Date;
    fechaEdicionSubActividad: Date;
    tipo: string; //Académico, Financiero, Grados
}

export interface CalendarioCreacionDTO
{
    nombreActividad: string;
    estadoActividad?: number;
    fechaCreacionActividad?: Date;
    nombreSubActividad: string;
    estadoSubActividad?: number;
    fechaInicio: Date;
    fechaFin?: Date;
    fechaCreacionSubActividad?: Date;
    tipo: string; //Académico, Financiero, Grados
}