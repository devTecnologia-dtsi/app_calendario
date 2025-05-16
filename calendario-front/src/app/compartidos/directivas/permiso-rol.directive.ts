import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  OnInit
} from '@angular/core';
import { RolService } from '../servicios/rol.service';

interface PermisoRolArgs {
  rol: string;
  permiso: 'crear' | 'leer' | 'actualizar' | 'borrar';
}

@Directive({
  selector: '[permisoRol]',
  standalone: true
})
export class PermisoRolDirective implements OnInit {
  private template = inject(TemplateRef<any>);
  private container = inject(ViewContainerRef);
  private rolService = inject(RolService);

  @Input('permisoRol') args!: PermisoRolArgs;

  ngOnInit(): void {
    this.rolService.listarRoles().subscribe({
      next: (resp) => {
        const roles = resp?.data || [];

        const rolEncontrado = roles.find(
          (r: any) => r.nombre.toLowerCase() === this.args.rol.toLowerCase()
        );

        const tienePermiso = rolEncontrado?.[this.args.permiso] === 1;

        if (tienePermiso) {
          this.container.createEmbeddedView(this.template);
        } else {
          this.container.clear();
        }
      },
      error: () => this.container.clear()
    });
  }
}
