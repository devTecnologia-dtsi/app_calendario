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
    nombre: string;
    // 0 = No tiene permiso, 1 = Tiene permiso
    leer: number;
    crear: number; 
    actualizar: number;
    borrar: number;
    actividad: number;
    subactividad: number;
    calendario: number;
    sistema: number;
    
}