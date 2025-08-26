import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  mostrarInfo(mensaje: string, titulo: string = 'Información') {
    Swal.fire({
      icon: 'info',
      title: titulo,
      text: mensaje
    });
  }
  
  mostrarExito(mensaje: string = 'Operación exitosa', titulo: string = '¡Éxito!') {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje,
      timer: 3000,
      timerProgressBar: true
    });
  }

  mostrarError(mensaje: string = 'Ocurrió un error', titulo: string = 'Error') {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
      timer: 5000
    });
  }

  mostrarAdvertencia(mensaje: string = '¿Estás seguro?', titulo: string = 'Confirmación') {
    Swal.fire({
      icon: 'warning',
      title: titulo,
      text: mensaje
    });
  }

  mostrarConfirmacion (mensaje: string = '¿Estás seguro?', titulo: string = 'Confirmación'): Promise<boolean>{
    return Swal.fire({
      icon: 'question',
      title: titulo,
      text: mensaje,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result)=> result.isConfirmed);
  }
}
