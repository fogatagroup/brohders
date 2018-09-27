import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Response } from '@angular/http'
import { HttpService } from './http.service';
import { serverUrl } from '../config/config';
import { ApiResponse } from '../models/response';
import { Shop } from '../models/shops';

@Injectable()
export class ShopService {
  private url: string = serverUrl
 

  constructor(private http: HttpService) {
  }

  fetchShops(): Observable<Shop[]> {
    const url = `${this.url}/api/shops`;
    return this.http.get(url)
      .map((response => { return (response.json() as ApiResponse).data }))
      .catch(this.handleErrorObservable)
  }

  private handleErrorObservable(error: Response | any) {
    return Observable.throw(error.message || error);
  }

}