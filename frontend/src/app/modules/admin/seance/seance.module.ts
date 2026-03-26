import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { MySeanceComponent } from './my-seance/my-seance.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'my', component: MySeanceComponent }
];

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule
  ],
  exports:[]
})
export class SeanceModule { }
