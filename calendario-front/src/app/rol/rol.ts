//Creación
export interface RolCreacionDTO {
    crear: number;
    leer: number;
    actualizar: number;
    borrar: number;
    actividad: number;
    subactividad: number;
    calendario: number;
    sistema: number;
    nombre: string;
}

//Lectura
export interface RolDTO{
    id: number;
    crear: number;
    leer: number;
    actualizar: number;
    borrar: number;
    actividad: number;
    subactividad: number;
    calendario: number;
    sistema: number;
    nombre: string;
}