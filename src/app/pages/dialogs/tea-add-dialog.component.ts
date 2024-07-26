import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TeaModel } from '../../models/tea.model';

interface IAddTeaForm {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  template: `
    <h1 mat-dialog-title>Add new tea</h1>
    <div mat-dialog-content>
      <form [formGroup]="addTeaForm">
        <mat-form-field class="full-width">
          <mat-label>Name</mat-label>
          <input type="text" matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description"></textarea>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button
        mat-raised-button
        color="primary"
        [disabled]="addTeaForm.invalid"
        (click)="sendTea()"
      >
        {{ !data ? 'Add tea' : 'Update tea' }}
      </button>
      <button mat-button (click)="cancelCreate()">Cancel</button>
    </div>
  `,
})
export class TeaAddDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<TeaAddDialogComponent>);
  data?: TeaModel = inject(MAT_DIALOG_DATA);
  
  addTeaForm: FormGroup<IAddTeaForm>;

  constructor() {
    this.addTeaForm = new FormGroup({
      name: new FormControl(this.data?.name ?? '', [Validators.required]),
      description: new FormControl(this.data?.description ?? '', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  sendTea(): void {
    if (!this.addTeaForm.invalid) {
      const data: Partial<TeaModel> = {
        ...this.data,
        name: this.addTeaForm.controls['name'].value ?? '',
        description: this.addTeaForm.controls['description'].value ?? '',
      };
      this.dialogRef.close(data);
    } else {
      this.cancelCreate();
    }
  }

  cancelCreate(): void {
    this.dialogRef.close();
  }
}
