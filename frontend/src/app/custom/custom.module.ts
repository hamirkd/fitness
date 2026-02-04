import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomComponent } from './custom.component';
import { MDialogMotifComponent } from './m-dialog-motif/m-dialog-motif.component';



@NgModule({
  declarations: [
    CustomComponent,
    MDialogMotifComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CustomModule { }
