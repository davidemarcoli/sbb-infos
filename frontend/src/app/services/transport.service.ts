import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  apiUrl = 'http://transport.opendata.ch/v1/connections';
  stationsFrom: string[] = [];
  stationsTo: string[] = [];

  constructor(private http: HttpClient) {}

  fetch(from?: string, to?: string, via?: string, datetime?: string, page: number = 0, c?: number): Observable<any> {
    let params = new HttpParams();

    if(from) params = params.set('from', from);
    if(to) params = params.set('to', to);
    if(via) params = params.set('via', via);
    if(datetime) {
      params = params.set('date', new Date(datetime).toLocaleDateString('en-CA'));
      params = params.set('time', new Date(datetime).toLocaleTimeString('it-IT').slice(0, 5));
    }
    params = params.set('page', page.toString());
    params = params.set('limit', '6');

    return this.http.get(this.apiUrl, { params: params });
  }

  processResponse(response: any) {
    if (response.from) {
      let from = response.from.name;
    }
    if (response.to) {
      let to = response.to.name;
    }

    if (response.stations?.from[0]?.score < 101) {
      this.stationsFrom = response.stations.from.slice(1, 4)
        .filter((station: any) => station.score > 97)
        .map((station: any) => station.name);
    }

    if (response.stations?.to[0]?.score < 101) {
      this.stationsTo = response.stations.to.slice(1, 4)
        .filter((station: any) => station.score > 97)
        .map((station: any) => station.name);
    }
  }
}
