import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Response } from '@angular/http'
import { HttpService } from './http.service';
import { serverUrl } from '../config/config';
import { Product } from '../models/products';
import { ApiResponse } from '../models/response';

@Injectable()
export class ProductService {
  private url: string = serverUrl
 

  constructor(private http: HttpService) {
  }

  fetchProducts(): Observable<Product[]> {
    const url = `${this.url}/api/products`;
    return this.http.get(url)
      .map((response => { return (response.json() as ApiResponse).data }))
      .catch(this.handleErrorObservable)
  }

  private handleErrorObservable(error: Response | any) {
    return Observable.throw(error.message || error);
  }

}