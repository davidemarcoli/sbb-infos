import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {TransportService} from "../services/transport.service";

export interface ConnectionsResponse {
  connections: Connection[];
  from: Station;
  to: Station;
  stations: Station[]
}

export interface Connection {
  from: StationInfo;
  to: StationInfo;
  duration: string;
  transfers: number;
  service: string;
  products: string[];
  capacity1st: string;
  capacity2nd: string;
  sections: Section[]
}
export interface StationInfo {
  station: Station;
  arrival: string | null;
  arrivalTimestamp: number | null;
  departure: string | null;
  departureTimestamp: number | null;
  delay: string;
  platform: string;
  prognosis: Prognosis;
  realtimeAvailability: boolean;
  location: Coordinate;
}

export interface Station {
  id: string;
  name: string;
  score: number | null;
  coordinate: Coordinate;
  distance: number;
}

export interface Coordinate {
  type: string;
  x: number;
  y: number;
}

export interface Prognosis {
  platform: string | null;
  arrival: string | null;
  departure: string | null;
  capacity1st: string;
  capacity2nd: string;
}

export interface Section {
  departure: StationInfo;
  arrival: StationInfo;
  journey: Journey | null;
  walk: string
}

export interface Journey {
  name: string;
  category: string;
  subcategory: string;
  number: string;
  operator: string;
  to: string;
  passList: StationInfo;
  capacity1st: number;
  capacity2nd: number;
}


@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit {

  from: string = '';
  to: string = '';
  isFromInputFocused = false;
  c: number = 0;
  connections: {
    connection: Connection,
    visible: boolean,
  }[] = [];
  stations: Station[] = [];
  form: FormGroup;
  stationsFrom: string[] = []; // fill with actual values
  stationsTo: string[] = []; // fill with actual values

  response: ConnectionsResponse | undefined;

  search = false

  constructor(private http: HttpClient, private fb: FormBuilder, private transportService: TransportService) {
    this.form = this.fb.group({
      from: [''],
      to: [''],
      datetime: ['']
    });
  }

  ngOnInit() {
    if (navigator.geolocation && !this.from) {
      this.from = 'Locating...';
      let i = 0;
      let interval = setInterval(() => {
        i = (i + 1) % 4;
        let message = 'Locating';
        for (let j = 0; j < i; j++) {
          message += '.';
        }
        this.from = message;
      }, 400);

      let watch = navigator.geolocation.watchPosition((position) => {
        console.log(position)
        if (position.coords.accuracy < 100) {
          navigator.geolocation.clearWatch(watch);

          let lat = position.coords.latitude;
          let lng = position.coords.longitude;

          this.http.get('http://transport.opendata.ch/v1/locations', { params: { x: lat, y: lng } }).subscribe((data: any) => {
            clearInterval(interval);
            this.from = 'From';
            this.stations = data.stations;

            if (this.stations && this.stations.length > 0 && !this.from) {
              this.from = this.stations[0].name;
            }
          });
        }
      }, (error) => {
        // handle error
      }, {
        enableHighAccuracy:true,
        maximumAge: 10000,
        timeout: 30000
      });
    }
  }

  reset() {
    this.connections.forEach(connection => {
      connection.visible = true;
      //connection.connection.sections.forEach(section => section.visible = false);
    });
  }

  onConnectionClick(index: number) {
    this.reset();
    this.connections[index].visible = false;
    //this.connections[index].sections.forEach(section => section.visible = true);
    this.c = index;
    // modify the url using angular router
  }

  onFocus() {
    this.isFromInputFocused = true;
  }

  onBlur() {
    this.isFromInputFocused = false;
  }

  onFormSubmit(): void {
    this.search = true
    console.log(this.form.value);

    this.transportService.fetch(this.form.get("from")?.value, this.form.get("to")?.value, undefined, this.form.get("datetime")?.value).subscribe(value => {
      this.transportService.processResponse(value)
      this.stationsFrom = this.transportService.stationsFrom;
      this.stationsTo = this.transportService.stationsTo;
      console.log(value)
      this.connections = value.connections.map((value:any) => {
        return {
          connection: value,
          visible: true
        }
      });
      this.stations = value.stations;
      this.response = value;
    })
  }

  onClear(): void {
    this.form.reset();
  }
}
