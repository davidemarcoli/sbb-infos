import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Timestamp} from "rxjs/internal-compatibility";

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit {

  result: any;

  form = this.formBuilder.group({
      from: ['', [
        Validators.required,
        Validators.maxLength(255),
      ]],
      to: ['', [
        Validators.required,
        Validators.maxLength(255),
      ]],
      date: ['', [
        Validators.required,
        // Validators.min(Date.now())
      ]],
    }
  )
  ;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.form)

    this.http.get<any>("http://transport.opendata.ch/v1/connections?from=" + this.form.value.from + "&to=" + this.form.value.to + "&date=" + this.form.value.date + "&" + "&time=" + Timestamp + "&page=1&limit=6").subscribe(
      (response) => {
        console.log(response)
        this.result = response;
      },
      (error) => {
        console.error(error)
      }
    )

    // http_build_query(['from' => $station, 'to' => $to, 'datetime' => $datetime]
    // $url = 'http://transport.opendata.ch/v1/connections?'.http_build_query($query);
  }

}
