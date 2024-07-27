import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <mat-card class="login-card">
        <mat-card-content>
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" />
            <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
              Invalid email format
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" />
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading">
            Login
          </button>
          <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
          <button mat-raised-button color="accent" (click)="goToRegister()">Go to Register</button>
        </mat-card-content>
      </mat-card>
    </form>
  `,
  styles: [
    `

mat-card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #cab9e9;
  border-color: #cab9e9;
}

mat-card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}



.full-width {
  width: 100%;
  
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 8px;
}
    `
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.isLoading = true;
    this.authService.login(email, password).pipe(
      catchError((err: any) => {
        this.errorMessage = err.message;
        this.isLoading = false;
        return of(null);
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
