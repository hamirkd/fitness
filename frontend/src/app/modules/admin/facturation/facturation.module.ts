import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturationComponent } from './facturation.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { TarifComponent } from './tarif/tarif.component';
import { AddTarifComponent } from './tarif/add-tarif/add-tarif.component';
import { FactureComponent } from './consultation/facture.component';
import { NouvelleFactureComponent } from './nouvelle-facture/nouvelle-facture.component';
import { FactureMotifAnnulationComponent } from './consultation/facture-motif-annulation/facture-motif-annulation.component';


const routes: Routes = [
  { path: '', component: FacturationComponent },
  { path: 'consultation', component: FactureComponent },
  { path: 'tarif', component: TarifComponent },
  { path: 'tarif-add', component: AddTarifComponent },
  { path: 'nouvelle', component: NouvelleFactureComponent }
];

@NgModule({
  declarations: [
    FacturationComponent,
    FactureComponent,
    TarifComponent,
    AddTarifComponent,
    NouvelleFactureComponent, FactureMotifAnnulationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),SharedModule
  ]
})
export class ScolariteModule { }
