import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MConfirmationConfig } from './m-confirmation-config.types';

@Component({
  selector: 'app-m-dialog-motif',
  templateUrl: './m-dialog-motif.component.html',
  styleUrls: ['./m-dialog-motif.component.scss'],
  styles       : [
      /* language=SCSS */
      `
          .fuse-confirmation-dialog-panel {
              @screen md {
                  @apply w-128;
              }

              .mat-dialog-container {
                  padding: 0 !important;
              }
          }
      `
  ],
  encapsulation: ViewEncapsulation.None
})
export class MDialogMotifComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MConfirmationConfig,
    public matDialogRef: MatDialogRef<MDialogMotifComponent>) { }

  ngOnInit(): void {
  }

}
