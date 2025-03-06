import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioDTO } from '../usuario';
import { DatePipe, CommonModule } from '@angular/common';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { Router } from '@angular/router';
import { ListadoGenericoComponent } from "../../compartidos/componentes/listado-generico/listado-generico.component";

@Component({
  selector: 'app-indice-usuarios',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    ListadoGenericoComponent,
    MatTableModule,
    MatPaginatorModule,
    // CommonModule,
    // MatButtonModule,
    // RouterLink,
    // MatTableModule,
    // MatPaginatorModule,
    // HttpClientModule,
    // DatePipe,
    // ListadoGenericoComponent
],
  templateUrl: './indice-usuarios.component.html',
  styleUrls: ['./indice-usuarios.component.css']
})

export class IndiceUsuariosComponent {

  usuarioService = inject(UsuarioService);
  // usuarios!: UsuarioDTO[];
  dataSource = new MatTableDataSource<UsuarioDTO>();

  columnasAMostrar = ['id', 'correo', 'nombre_rectoria', 'nombre_sede', 'fechaCreacion', 'nombre_rol', 'acciones'];

  @ViewChild(MatPaginator) 
  paginator!: MatPaginator;

  constructor(){
    this.usuarioService.listarUsuarios().subscribe(usuarios => {
      this.dataSource.data = usuarios;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}



