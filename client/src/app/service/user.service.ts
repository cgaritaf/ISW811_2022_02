import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

const baseUrl = `${environment.apiUrl}/user`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }


  singin(data: any): Observable<any> {
    return this.http.post(baseUrl  + '/signin/', data);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl   + '/signup/', data);
  }



}