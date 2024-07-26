import { Injectable, inject } from '@angular/core';
import { TeaModel } from '../models/tea.model';
import { Observable, Subject, map, tap } from 'rxjs';
import { HttpClient, HttpParams} from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class TeaService {
private http: HttpClient = inject(HttpClient);
private authService: AuthService = inject (AuthService);

private _teaSelectedData!: TeaModel;
private _teaSelected: Subject<TeaModel> = new Subject<TeaModel>();
teaSelected$: Observable<TeaModel>= this._teaSelected.asObservable();

get teaSeleted(): TeaModel {
  return this._teaSelectedData;
}

  constructor() { }

  getAllTeas(): Observable<TeaModel []> {
    return this.http.get<TeaModel []>('/api/teas',{
      params: new HttpParams().set('userId', this.authService.user.id)
    });
  }

  getTea(id: string): Observable<TeaModel> {
    return this.http
    .get<TeaModel []>('/api/teas',{
      params: new HttpParams()
      .set('userId', this.authService.user.id)
      .set('id', id)
    })
    .pipe(map((response)=> response[0]));
    }

    setTea(tea: TeaModel): void{
      this._teaSelectedData = tea;
      this._teaSelected.next(tea);
    }

    addTea(param: TeaModel): Observable<TeaModel> {
      return this.http.post<TeaModel>('/api/teas',{
        ...param,
        userId: this.authService.user.id,
      });
    }

    updateTea(param: TeaModel): Observable<TeaModel>{
      return this.http.put<TeaModel>(`/api/teas/${param.id}`,param)
    }

    deleteTea(param: TeaModel): Observable<void> {
      return this.http.delete<void>(`/api/teas/${param.id}`, {
        params: new HttpParams()
        .set('userId', this.authService.user.id)
        .set('id', param.id),
      });
    }
}

