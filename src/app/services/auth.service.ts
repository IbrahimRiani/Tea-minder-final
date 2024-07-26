import { HttpClient, HttpParams  } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { UserModel } from '../models/user.model';

export interface IRegisterUser{
  name: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http: HttpClient = inject(HttpClient)
  
  get user(): UserModel{
    return JSON.parse(sessionStorage.getItem('user')!) as unknown as UserModel;
  }

  constructor() { }

  login(email: string, password: string): Observable<UserModel> {
    return this.http
    .get<UserModel []>('/api/users', {
      params: new HttpParams().set('email', email).set('password', password)
    })
    .pipe(
      switchMap((response)=> {
        if (response.length === 1){
          sessionStorage.setItem('user', JSON.stringify(response[0]));
          return of<UserModel>(response[0]);
        }
        throw new Error ('No ha usuarios con estas credenciales')
      })
    )
  }

  registerUser(params: IRegisterUser): Observable<UserModel> {
    return this.http.post<UserModel>('/api/users', {
      ...params,
    });
  }

  logout(): void{
    sessionStorage.removeItem('user');
  }

}
