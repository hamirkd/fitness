import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbonneComponent } from './abonne.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { AddAbonneComponent } from './add-abonne/add-abonne.component';
import { ListAbonneComponent } from './list-abonne/list-abonne.component';
import { DetailAbonneComponent } from './detail-abonne/detail-abonne.component';
import { GeolocationComponent } from './geolocation/geolocation.component';
import { MediaAddComponent } from './media-add/media-add.component';


const routes: Routes = [
  { path: '', component: AbonneComponent },
  { path: 'list', component: ListAbonneComponent },
  { path: 'show/:abonne_id', component: DetailAbonneComponent },
];

@NgModule({
  declarations: [
    AbonneComponent,
    AddAbonneComponent,ListAbonneComponent,DetailAbonneComponent, GeolocationComponent, MediaAddComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,SharedModule
  ]
})
export class AbonneModule { }
