// Creación
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
    [key: string]: number | string;
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


// export interface RolCreacionDTO 
// {
//     nombre: string;
//     leer: boolean;
//     crear: boolean;
//     actualizar: boolean;
//     borrar: boolean;
//     actividad: boolean;
//     subactividad: boolean;
//     calendario: boolean;
//     sistema: boolean;
// }