export function extraerErrores(obj: any): string[] {
    const err = obj?.error?.errors; // Asegurar que existe `errors`
    let mensajeDeError: string[] = [];

    if (err && typeof err === 'object') {
        for (let llave in err) {
            if (Array.isArray(err[llave])) {
                mensajeDeError = mensajeDeError.concat(err[llave]);
            }
        }
    } else if (obj?.error?.message) {
        mensajeDeError.push(obj.error.message);
    } else if (typeof obj?.error === 'string') {
        mensajeDeError.push(obj.error);
    } else {
        mensajeDeError.push('Error desconocido. Inténtelo más tarde.');
    }

    return mensajeDeError;
}
