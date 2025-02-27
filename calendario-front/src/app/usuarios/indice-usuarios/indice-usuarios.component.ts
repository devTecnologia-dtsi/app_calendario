import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UsuarioDTO } from '../usuario';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-indice-usuarios',
  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink, 
    MatTableModule, 
    MatPaginatorModule,
    HttpClientModule,
    DatePipe
  ],
  templateUrl: './indice-usuarios.component.html',
  styleUrls: ['./indice-usuarios.component.css']
})
export class IndiceUsuariosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'correo', 'estado', 'id_rectoria', 'id_sede', 'fecha_ingreso', 'fecha_creacion', 'id_rol'];
  dataSource = new MatTableDataSource<UsuarioDTO>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<UsuarioDTO[]>('http://localhost/calendario-back/src/models/usuario.php').subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}


