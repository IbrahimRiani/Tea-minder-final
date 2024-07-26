import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, IRegisterUser } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
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
     <div class="container">
  <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
    <mat-card>
      <mat-card-content>
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
          <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
            Invalid email format
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" />
          <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
            Password is required
          </mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid">Register</button>
        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

        <div class="form-actions">
          <button mat-button (click)="goToLogin()">Login</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`

.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  
  width: 100%;
  background: #2c2c2c;
  max-width: 400px; /* Ajustar ancho máximo */
  color: #f5f5f5; /* Color de texto claro */
  
}


button {
  width: 100%;
  margin-top: 16px; /* Espacio sobre el botón */
}

.error-message {
  color: #ff4d4d; /* Color rojo claro para mensajes de error */
  text-align: center;
  margin-top: 12px;
}

.form-actions {
  margin-top: 16px;
  text-align: center;
}

mat-form-field mat-label {
  color: #f5f5f5; /* Color claro para etiquetas */
  
}

mat-card-content{
  padding-left: 25%;
  padding-right: 25%;
  background-color: #cab9e9;
}

input {
  color: #333; /* Color oscuro para el texto de entrada */
  background: #444; /* Fondo oscuro para campos de entrada */
}

input:focus {
  border-color: #fff; /* Borde blanco al enfocar */
}
    `
  ]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const { name, email, password } = this.registerForm.value;
    this.authService.registerUser({ name, email, password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: any) => (this.errorMessage = err.message),
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
