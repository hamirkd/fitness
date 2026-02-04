import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-facture-motif-annulation',
  templateUrl: './facture-motif-annulation.component.html',
  styleUrls: ['./facture-motif-annulation.component.scss']
})
export class FactureMotifAnnulationComponent implements OnInit {

  id
  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
  public matDialogRef: MatDialogRef<FactureMotifAnnulationComponent>,) {
        this.id = _data.id;
   }
  motif = new FormControl()
  ngOnInit(): void {

  }
  onSubmit() {

            this.matDialogRef.close({motif:this.motif.value,id:this.id});
    
}

}
