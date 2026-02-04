import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module'; 
import { MatRadioModule } from '@angular/material/radio';
import { MonProfilComponent } from './mon-profil.component';
import { ProfilComponent } from './profil/profil.component';
import { ProfilPasswordComponent } from './profil-password/profil-password.component';


const routes: Routes = [
  { path: '', component: MonProfilComponent },
  { path: '/edit', component: ProfilComponent },
  { path: '/editpassword', component: ProfilPasswordComponent },
];

@NgModule({
  declarations: [
    MonProfilComponent,ProfilComponent,ProfilPasswordComponent
  ],
  imports: [
    CommonModule,MatRadioModule,
    RouterModule.forChild(routes),SharedModule
  ]
})
export class MonProfilModule { }
