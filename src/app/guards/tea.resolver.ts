import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first, map, switchMap, tap } from 'rxjs/operators';
import { TeaModel } from '../models/tea.model';
import { TeaService } from '../services/tea.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const TeaResolver: ResolveFn<TeaModel | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<TeaModel | null> => {
  const teaService = inject(TeaService);
  const snackBar = inject(MatSnackBar);

  const id = route.params['id'];
  return teaService.teaSelected$.pipe(
    first(),
    switchMap((teaSelected) => {
      if (teaSelected) {
        return of(teaSelected);
      } else {
        return teaService.getTea(id).pipe(
          tap((tea) => {
            if (!tea) {
              snackBar.open(`Error loading tea: No tea found with id ${id}`, 'Close', {
                duration: 3000,
              });
            }
          }),
          catchError((error) => {
            snackBar.open(`Error loading tea: ${error.message}`, 'Close', {
              duration: 3000,
            });
            return of(null);
          })
        );
      }
    })
  );
};
