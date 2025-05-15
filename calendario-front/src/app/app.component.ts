import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./compartidos/componentes/menu/menu.component";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuComponent,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private authService = inject(MsalService);
  private router = inject(Router);

  get mostrarMenu(): boolean {
    // Puedes agregar más rutas si necesitas ocultar el menú en otras páginas
    return this.router.url !== '/login';
  }

  ngOnInit() {
    this.authService.instance.handleRedirectPromise().then((result) => {
      if (result !== null && result.account !== null) {
        this.authService.instance.setActiveAccount(result.account);
        this.router.navigate(['/dashboard']); // o la ruta que tengas
      } else {
        const activeAccount = this.authService.instance.getActiveAccount();
        if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
          this.authService.instance.setActiveAccount(this.authService.instance.getAllAccounts()[0]);
        }
      }
    });
  }
}
