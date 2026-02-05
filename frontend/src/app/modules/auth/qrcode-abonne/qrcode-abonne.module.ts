import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { qrCodeAbonneRoutes } from './qrcode-abonne.routing';
import { QrCodeAbonneComponent } from './qrcode-abonne.component';

@NgModule({
    declarations: [
        QrCodeAbonneComponent
    ],
    imports     : [
        RouterModule.forChild(qrCodeAbonneRoutes)
    ],
    exports: [QrCodeAbonneComponent]
})
export class QrCodeAbonneModule
{
}
