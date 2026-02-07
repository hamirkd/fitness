import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbonnementIndexComponent } from './index.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { TarifComponent } from './tarif/tarif.component';
import { AddTarifComponent } from './tarif/add-tarif/add-tarif.component';
import { AbonnementComponent } from './consultation/abonnement.component';
import { AddAbonnementComponent } from './add-abonnement/add-abonnement.component';
import { AbonnementMotifAnnulationComponent } from './consultation/abonnement-motif-annulation/abonnement-motif-annulation.component';


const routes: Routes = [
  { path: '', component: AbonnementIndexComponent },
  { path: 'consultation', component: AbonnementComponent },
  { path: 'tarif', component: TarifComponent },
  { path: 'tarif-add', component: AddTarifComponent },
  { path: 'nouveau', component: AddAbonnementComponent }
];

@NgModule({
  declarations: [
    AbonnementIndexComponent,
    AbonnementComponent,
    TarifComponent,
    AddTarifComponent,
    AddAbonnementComponent, AbonnementMotifAnnulationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),SharedModule
  ]
})
export class IndexAbonnementModule { }
