import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./compartidos/componentes/menu/menu.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private authService = inject(MsalService);
  private router = inject(Router);

  get mostrarMenu(): boolean {
    return this.router.url !== '/login';
  }

  ngOnInit() {
    this.authService.instance.handleRedirectPromise().then((result) => {
      if (result?.account) {
        this.authService.instance.setActiveAccount(result.account);

        // Redirección flexible
        const redirectUrl = sessionStorage.getItem('redirectUrl') || '/dashboard';
        this.router.navigate([redirectUrl]);
        sessionStorage.removeItem('redirectUrl');
      } else {
        const activeAccount = this.authService.instance.getActiveAccount();
        if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
          this.authService.instance.setActiveAccount(this.authService.instance.getAllAccounts()[0]);
        }
      }
    });
  }
}
