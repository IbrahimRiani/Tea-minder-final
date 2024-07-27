import { Injectable, inject } from '@angular/core';
import { TeaModel } from '../models/tea.model';
import { Observable, Subject, map, tap, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeaService {
  private http: HttpClient = inject(HttpClient);
  private authService: AuthService = inject(AuthService);

  private _teaSelectedData!: TeaModel;
  private _teaSelected: Subject<TeaModel> = new Subject<TeaModel>();
  teaSelected$: Observable<TeaModel> = this._teaSelected.asObservable();

  get teaSelected(): TeaModel {
    return this._teaSelectedData;
  }

  constructor() { }

  private getUserId(): string | null {
    const user = this.authService.user;
    return user ? user.id : null;
  }

  getAllTeas(): Observable<TeaModel[]> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<TeaModel[]>('/api/teas', {
      params: new HttpParams().set('userId', userId)
    });
  }

  getTea(id: string): Observable<TeaModel> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<TeaModel[]>('/api/teas', {
      params: new HttpParams()
        .set('userId', userId)
        .set('id', id)
    }).pipe(
      map(response => response[0]),
      tap(tea => {
        if (!tea) {
          throw new Error('Tea not found');
        }
      })
    );
  }

  setTea(tea: TeaModel): void {
    this._teaSelectedData = tea;
    this._teaSelected.next(tea);
  }

  addTea(param: TeaModel): Observable<TeaModel> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.post<TeaModel>('/api/teas', {
      ...param,
      userId
    });
  }

  updateTea(param: TeaModel): Observable<TeaModel> {
    return this.http.put<TeaModel>(`/api/teas/${param.id}`, param);
  }

  deleteTea(param: TeaModel): Observable<void> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.delete<void>(`/api/teas/${param.id}`, {
      params: new HttpParams()
        .set('userId', userId)
        .set('id', param.id)
    });
  }
}
