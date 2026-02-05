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
    svgContent!: SafeHtml;
    activation = false;
    private refreshTimer: any;

    constructor(
        private api: AbonneService,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.activation = true;
        this.loadSvg();
        this.startAutoRefresh();
    }

    ngOnDestroy(): void {
        this.activation = false;
        clearTimeout(this.refreshTimer);
    }

    private loadSvg(): void {
        this.api.getSvg().subscribe({
            next: (svg: string) => {
                this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
            },
            error: err => {
                console.error('Erreur chargement QR Code', err);
            }
        });
    }

    private startAutoRefresh(): void {
        this.refreshTimer = setTimeout(() => {
            if (this.activation) {
                this.loadSvg();
                this.startAutoRefresh();
            }
        }, 30000);
    }
}
