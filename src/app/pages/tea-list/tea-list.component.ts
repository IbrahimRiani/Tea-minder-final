import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Observable, Subject, filter, switchMap, takeUntil } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { TeaModel } from '../../models/tea.model';
import { TeaService } from '../../services/tea.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TeaAddDialogComponent } from '../dialogs/tea-add-dialog.component';
import { TeaDeleteDialogComponent } from '../dialogs/tea-delete-dialog.component';
import { Router, RouterModule } from '@angular/router';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-tea-list',
  template: `
    <div class="title-container">
      <h1>My Tea List</h1>
      <button mat-mini-fab color="primary" (click)="openAddTeaDialog()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
    <div *ngFor="let item of teaList" class="item-container">
      <mat-icon>emoji_food_beverage</mat-icon>
      <span class="item-title">{{ item.name | titlecase }}</span>
      <div>
        <button mat-icon-button color="warn" (click)="deleteTea(item)">
          <mat-icon>delete</mat-icon>
        </button>
        <button mat-icon-button color="primary" (click)="changeSelectedTea(item)">
          <mat-icon>open_in_new</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`

      .item-container{
        display: grid;
        align-items: center;
        grid-template-columns: auto 1fr auto;
      }
      .item-title{
        font-size: 1.2em;
        padding-left: 8px;
      }

    `,
  ],

  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatDialogModule,
  ],
})

export class TeaListComponent implements OnInit, OnDestroy {
  private teaService: TeaService = inject(TeaService);
  private dialog: MatDialog = inject(MatDialog);
  private router: Router = inject(Router);
  private destroy$: Subject<void> = new Subject();

  teaList: TeaModel[] = [];

  ngOnInit(): void {
    this.teaService
      .getAllTeas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value: TeaModel[]) => {
          this.teaList = value;
        },
      });
  }

  changeSelectedTea(tea: TeaModel): void {
    this.teaService.setTea(tea);
    this.router.navigate([`/teas/${tea.id}`]);
  }

  openAddTeaDialog(): void {
    const dialogRef = this.dialog.open(TeaAddDialogComponent);
    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        switchMap((result: TeaModel) => {
          return this.teaService.addTea(result);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (tea: TeaModel) => {
          this.teaList.push(tea);
        },
      });
  }

  deleteTea(tea: TeaModel): void {
    const dialogRef = this.dialog.open(TeaDeleteDialogComponent, {
      data: tea,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((f) => f),
        switchMap(() => {
          return this.teaService.deleteTea(tea);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.teaList.splice(
            this.teaList.findIndex((f) => f.id === tea.id),
            1
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
