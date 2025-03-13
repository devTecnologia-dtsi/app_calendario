import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UsuarioDTO } from '../usuario';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { ListadoGenericoComponent } from "../../compartidos/componentes/listado-generico/listado-generico.component";
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-indice-usuarios',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    ListadoGenericoComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule
],
  templateUrl: './indice-usuarios.component.html',
  styleUrls: ['./indice-usuarios.component.css']
})

export class IndiceUsuariosComponent implements OnInit {

  usuarioService = inject(UsuarioService);
  usuarios: UsuarioDTO[] = [];
  dataSource = new MatTableDataSource<UsuarioDTO>();

  columnasAMostrar = ['id', 'correo', 'nombre_rectoria', 'nombre_sede', 'fechaCreacion', 'nombre_rol', 'acciones'];

  @ViewChild(MatPaginator) 
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnInit() {
    this.listarUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  aplicarFiltro(event: Event) {
    const filtroValor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtroValor.trim().toLowerCase();
  }

  listarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.dataSource.data = usuarios;
      },
      error: (error) => console.error('Error al listar usuarios:', error)
    });
  }

  desactivarUsuario(id: number) {
    if (confirm('¿Seguro que quieres desactivar este usuario?')) {
      this.usuarioService.desactivarUsuario(id).subscribe({
        next: () => {
          alert('Usuario desactivado');
          this.listarUsuarios();
        },
        error: (error) => console.error('Error al desactivar el usuario:', error)
      });
    }
  }
  
}

// export class IndiceUsuariosComponent implements AfterViewInit {

//   usuarioService = inject(UsuarioService);
//   // usuarios!: UsuarioDTO[];
//   dataSource = new MatTableDataSource<UsuarioDTO>();

//   columnasAMostrar = ['id', 'correo', 'nombre_rectoria', 'nombre_sede', 'fechaCreacion', 'nombre_rol', 'acciones'];

//   @ViewChild(MatPaginator) 
//   paginator!: MatPaginator;

//   @ViewChild(MatSort)
//   sort!: MatSort;

//   constructor(){
//     this.usuarioService.listarUsuarios().subscribe(usuarios => {
//       this.dataSource.data = usuarios;
//     })
//   }

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//   }

//   aplicarFiltro(event: Event) {
//     const filtroValor = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filtroValor.trim().toLowerCase();
//   }
  






