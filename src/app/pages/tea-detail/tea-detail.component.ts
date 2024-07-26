import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  RouterModule
} from '@angular/router'
import { TeaService } from '../../services/tea.service';
import { TeaModel } from '../../models/tea.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TeaAddDialogComponent } from '../dialogs/tea-add-dialog.component'
import { MatDialog } from '@angular/material/dialog';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tea-detail',
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule
  ],
  standalone: true,
  template: `.
  <div class="flex-space-between">
    <h1>{{teaSelected.name}}</h1>
    <button mat-icon-button color="primary" (click)="editTea()">
    <mat-icon>edit</mat-icon>
    </button>
  </div>

  <p>{{teaSelected.description}}</p>
  `,
  styles: [`
    
    .title-data {
      display: flex;
      h1{
        margin: 0;
      }
    }

    `,]
})

export class TeaDetailComponent {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private dialog: MatDialog = inject(MatDialog);
  private teaService: TeaService = inject(TeaService);
  private destroy$: Subject<void> = new Subject();

  teaSelected!: TeaModel;
  constructor()
  {
    const tea = this.activatedRoute.snapshot.data['tea'];
    if(tea){
      this.teaSelected = tea;
    }else {
      this.router.navigate(['/'])
    }
  }

  editTea(): void {
    const dialogRef=this.dialog.open(TeaAddDialogComponent, {
      data: this.teaSelected,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result)=> !!result),
        switchMap((result: TeaModel)=>{
          return this.teaService.updateTea(result);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (tea: TeaModel)=> {
          this.teaSelected = tea;
        }
      })

  }

}
