import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { LogsService, LogsDTO } from '../compartidos/servicios/logs.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { NotificacionService } from '../compartidos/servicios/notificacion.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-logs',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit{

  // Inyecciones de servicios
  logsService = inject(LogsService);
    notificacionService = inject(NotificacionService);
  

  // Propiedades
  logs : LogsDTO[] = [];
  dataSource = new MatTableDataSource<LogsDTO>();
  columnasAMostrar = ['id', 'estado', 'fecha', 'descripcion', 'correo'];

  // Control de paginación
  totalLogs = 0;
  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.listarLogs();
  }

  // Obtener logs paginados
  listarLogs() {
    const limite = this.pageSize;
    const offset = this.pageIndex * this.pageSize;

    this.logsService.listarLogs(limite, offset).subscribe({
      next: (respuesta) => {
        if (respuesta.status === 1){
          this.logs = Array.isArray(respuesta.data) ? respuesta.data : [];
          this.dataSource.data = this.logs;
          this.totalLogs = respuesta.total || 0;

        } else {
          this.notificacionService.mostrarAdvertencia(respuesta.message || 'No se encontraron logs', 'Aviso');
        }
      },
      error: (error) => this.notificacionService.mostrarError('Error al listar logs')
    });
  }

  // Cambiar de página en la paginación
  handlePageEvent(event: PageEvent) {
    console.log("Cambiando página: ", event);

    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.listarLogs();
  }
}
