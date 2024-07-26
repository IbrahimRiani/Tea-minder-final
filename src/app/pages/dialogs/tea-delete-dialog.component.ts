import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { TeaModel } from '../../models/tea.model';

@Component({
  selector: 'app-tea-delete-dialog',
  template: `
    <h1 mat-dialog-title>Delete Tea</h1>
    <div mat-dialog-content>
      <p>Are you sure you want to delete the tea "{{ data.name }}"?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onDelete()">Delete</button>
    </div>
  `,
  standalone: true,
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions],
})
export class TeaDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TeaDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeaModel
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close(true);
  }
}
