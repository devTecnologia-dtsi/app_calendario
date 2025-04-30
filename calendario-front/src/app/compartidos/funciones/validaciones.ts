import { AbstractControl, ValidationErrors } from '@angular/forms';

// Valida que la fecha no sea anterior a hoy
export function fechaNoPasadaValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const fecha = new Date(valor);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  return fecha < hoy ? { fechaPasada: 'La fecha no puede ser menor que hoy' } : null;
}

// Valida que la fecha fin no sea anterior a fecha inicio
export function fechaFinPosteriorValidator(fechaInicioKey: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null;

    const fechaFin = control.value;
    const fechaInicio = control.parent.get(fechaInicioKey)?.value;

    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      return { finAntesInicio: 'La fecha fin no puede ser anterior a la fecha inicio' };
    }

    return null;
  };
}
