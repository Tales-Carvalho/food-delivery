import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private API_SERVER = 'http://192.168.0.20:3000';

  public result;

  constructor(private httpClient: HttpClient) { }

  public getMenu() {
    return this.httpClient.get(this.API_SERVER + '/menu');
  }

  public postOrder(body) {
    return this.httpClient.post(this.API_SERVER + '/order', body);
  }

  public getOrders() {
    return this.httpClient.get(this.API_SERVER + '/order');
  }

  public patchOrder(body) {
    return this.httpClient.patch(this.API_SERVER + '/order', body);
  }
}
