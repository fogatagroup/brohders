import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Response } from '@angular/http'
import { HttpService } from './http.service';
import { serverUrl } from '../config/config';
import { ApiResponse } from '../models/response';
import { Tastings } from '../models/tastings';

@Injectable()
export class TastingService {
  private url: string = serverUrl
 

  constructor(private http: HttpService) {
  }

  fetchTastings(): Observable<Tastings[]> {
    const url = `${this.url}/api/tastings`;
    return this.http.get(url)
      .map((response => { return (response.json() as ApiResponse).data }))
      .catch(this.handleErrorObservable)
  }

  private handleErrorObservable(error: Response | any) {
    return Observable.throw(error.message || error);
  }

}