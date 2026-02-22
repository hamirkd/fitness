import { Route } from '@angular/router';
import { QrCodeAbonneComponent } from './qrcode-abonne.component';
import { QrcodeSeanceParticipationComponent } from './qrcode-seance-participation/qrcode-seance-participation.component';

export const qrCodeAbonneRoutes: Route[] = [

    {
        path     : 'participer',
        component: QrcodeSeanceParticipationComponent
    },{
        path     : 'participer/:id',
        component: QrcodeSeanceParticipationComponent
    },
    {
        path     : 'qrCode',
        component: QrCodeAbonneComponent
    },
];
