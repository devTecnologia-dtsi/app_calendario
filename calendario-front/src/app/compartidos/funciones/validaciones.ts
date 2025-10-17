import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Valida que la fecha no sea anterior a hoy (pero permite fechas originales en modo edición)
export function fechaNoPasadaValidator(valorInicial?: Date | null): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!valor) return null;

    try {
      const fecha = new Date(valor);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      fecha.setHours(0, 0, 0, 0);

      // Si hay fecha inicial y es la misma, permitir
      if (valorInicial) {
        const fechaInicial = new Date(valorInicial);
        fechaInicial.setHours(0, 0, 0, 0);
        
        if (fecha.getTime() === fechaInicial.getTime()) {
          return null;
        }
      }

      // Si la fecha es anterior a hoy, no permitir
      return fecha < hoy ? { fechaPasada: true } : null;
    } catch (error) {
      console.error('Error en fechaNoPasadaValidator:', error);
      return null;
    }
  };
}

// Valida que la fecha fin no sea anterior a la fecha inicio
export function fechaFinPosteriorValidator(fechaInicioKey: string, valorFinInicial?: Date | null): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null;

    const fechaFin = control.value;
    const fechaInicio = control.parent.get(fechaInicioKey)?.value;
    
    if (!fechaFin) return null;

    try {
      const fechaFinDate = new Date(fechaFin);
      fechaFinDate.setHours(0, 0, 0, 0);

      // Si hay fecha fin inicial y es la misma, solo validar posterior a inicio
      if (valorFinInicial) {
        const fechaFinInicial = new Date(valorFinInicial);
        fechaFinInicial.setHours(0, 0, 0, 0);
        
        if (fechaFinDate.getTime() === fechaFinInicial.getTime()) {
          // Solo validar que sea posterior a inicio
          if (fechaInicio) {
            const fechaInicioDate = new Date(fechaInicio);
            fechaInicioDate.setHours(0, 0, 0, 0);
            
            return fechaFinDate < fechaInicioDate ? { finAntesInicio: true } : null;
          }
          return null;
        }
      }

      // Si la fecha cambió, aplicar todas las validaciones
      
      // Validar que fin sea posterior a inicio
      if (fechaInicio) {
        const fechaInicioDate = new Date(fechaInicio);
        fechaInicioDate.setHours(0, 0, 0, 0);
        
        if (fechaFinDate < fechaInicioDate) {
          return { finAntesInicio: true };
        }
      }

      // Validar que fin no sea pasada
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaFinDate < hoy) {
        return { fechaFinPasada: true };
      }

      return null;
    } catch (error) {
      console.error('Error en fechaFinPosteriorValidator:', error);
      return null;
    }
  };
}

// Valida que el campo no sea solo espacios
export function noSoloEspaciosValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined) return null;
    const esSoloEspacios = typeof control.value === 'string' && control.value.trim().length === 0;
    return esSoloEspacios ? { soloEspacios: true } : null;
  };
}