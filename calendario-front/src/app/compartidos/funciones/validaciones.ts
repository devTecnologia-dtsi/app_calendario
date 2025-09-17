import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Valida que la fecha no sea anterior a hoy
export function fechaNoPasadaValidator(valorInicial?: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!valor) return null;

    const fecha = new Date(valor);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (valorInicial && fecha.getTime() === new Date(valorInicial).getTime()) {
      return null;
    }

    return fecha < hoy ? { fechaPasada: true } : null;
  };
}

// Valida que la fecha fin no sea anterior a fecha inicio
export function fechaFinPosteriorValidator(fechaInicioKey: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null;

    const fechaFin = control.value;
    const fechaInicio = control.parent.get(fechaInicioKey)?.value;
    

    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      return { finAntesInicio: true };
    }

    return null;
  };
}

// Valida que el campo no sea solo espacios en blanco
export function noSoloEspaciosValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined) return null;
    const esSoloEspacios = typeof control.value === 'string' && control.value.trim().length === 0;
    return esSoloEspacios ? { soloEspacios: true } : null;
  };
}

