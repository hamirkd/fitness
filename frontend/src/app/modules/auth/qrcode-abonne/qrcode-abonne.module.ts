import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { qrCodeAbonneRoutes } from './qrcode-abonne.routing';
import { QrCodeAbonneComponent } from './qrcode-abonne.component';
import { QrcodeSeanceParticipationComponent } from './qrcode-seance-participation/qrcode-seance-participation.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FuseFullscreenModule } from '@fuse/components/fullscreen';

@NgModule({
    declarations: [
        QrCodeAbonneComponent,
        QrcodeSeanceParticipationComponent,
    ],
    imports     : [
        RouterModule.forChild(qrCodeAbonneRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule, MatFormFieldModule,
        MatInputModule,FuseFullscreenModule
        
    ],
    exports: [QrCodeAbonneComponent, QrcodeSeanceParticipationComponent]
})
export class QrCodeAbonneModule
{
}
