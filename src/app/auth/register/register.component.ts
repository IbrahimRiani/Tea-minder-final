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
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" />
              <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

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
            <button mat-raised-button color="accent" (click)="goToLogin()">Go to Login</button>
            <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
          </mat-card-content>
        </mat-card>
      </form>
    </div>
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
