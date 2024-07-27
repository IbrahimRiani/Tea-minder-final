import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';

export interface IRegisterUser {
  name: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);

  get user(): UserModel | null {
    return JSON.parse(sessionStorage.getItem('user')!) as UserModel | null;
  }

  constructor() { }

  login(email: string, password: string): Observable<UserModel> {
    return this.http
      .get<UserModel[]>('/api/users', {
        params: new HttpParams().set('email', email)
      })
      .pipe(
        switchMap(response => {
          if (response.length === 1 && response[0].password === password) {
            sessionStorage.setItem('user', JSON.stringify(response[0]));
            return of(response[0]);
          } else {
            return throwError(() => new Error('Invalid email or password'));
          }
        }),
        catchError(error => throwError(() => new Error('Invalid login attempt')))
      );
  }

  registerUser(params: IRegisterUser): Observable<UserModel> {
    return this.http.post<UserModel>('/api/users', params);
  }

  logout(): void {
    sessionStorage.removeItem('user');
  }
}
