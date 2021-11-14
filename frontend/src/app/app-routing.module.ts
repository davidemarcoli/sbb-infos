import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ConnectionsComponent} from "./connections/connections.component";

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "connections",},
  {path: "connections", pathMatch: "full", component: ConnectionsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
