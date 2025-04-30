import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule } from '@angular/common';
import { filter, Subject, Subscription } from 'rxjs';
import {MsalService,MsalModule,MsalBroadcastService,MSAL_GUARD_CONFIG,MsalGuardConfiguration
} from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
// import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MsalModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzSpinModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly destroying$ = new Subject<void>();
  isIframe = false;
  isLoading = false;
  loginDisplay = false;
  mensajeError = '';
  isVisible = false;
  isConfirmLoading = false;
  // private loadingSubscription: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private message: NzMessageService,
    // private loadingService: LoadingService
  ) {
    // this.loadingSubscription = this.loadingService.isLoading$().subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['messageError']) {
        this.mensajeError = params['messageError'].replace(/\\n/g, '\n');
        this.message.error(`<b>¡Ups!</b> ${this.mensajeError}`, { nzDuration: 2500 });
        setTimeout(() => {
          this.authService.logoutRedirect();
          localStorage.clear();
        }, 2000);
      }
    });

    this.authService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result) {
          this.checkAndSetActiveAccount();
          this.router.navigate(['/calendario/crear']);
        }
      },
      error: (err) => console.error('Error en redirección', err)
    });

    this.setLoginDisplay();

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) =>
          msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  login(): void {
    this.authService.loginPopup().subscribe({
      next: () => {
        this.setLoginDisplay();
        this.router.navigate(['/rol']); // Redirigir a la página de inicio después de iniciar sesión
      },
      error: (err) => {
        console.error('Login fallido', err);
        this.message.error('Error al iniciar sesión');
      }
    });
  }

  setLoginDisplay(): void {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount(): void {
    const active = this.authService.instance.getActiveAccount();
    if (!active && this.authService.instance.getAllAccounts().length > 0) {
      this.authService.instance.setActiveAccount(this.authService.instance.getAllAccounts()[0]);
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
    // this.loadingSubscription.unsubscribe();
  }
}
