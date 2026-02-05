import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AbonneService } from 'app/core/services/abonne.service';

@Component({
    selector     : 'qrcode-abonne',
    templateUrl  : './qrcode-abonne.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class QrCodeAbonneComponent implements OnInit, OnDestroy
{
    
    svgContent: SafeHtml;
    activation: boolean;

    /**
     * Constructor
     */
    constructor(
        private api: AbonneService,
        private sanitizer: DomSanitizer
    )

    {
    }
  ngOnDestroy(): void {
    this.activation = false;
  }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
      this.activation = true;
        
        this.refresh();
    }
  
    refresh() {
      this.api.getSvg().subscribe(svg => {
        console.log(svg)
        this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
      });
      setTimeout(() => {
        if (this.activation) {
          this.refresh();
        }
        
      }, 30000);
    }
 
}
