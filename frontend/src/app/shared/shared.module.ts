import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TranslocoModule } from '@ngneat/transloco';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseCardModule } from '@fuse/components/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { QrCodeAbonneModule } from 'app/modules/auth/qrcode-abonne/qrcode-abonne.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule, MatButtonModule,
        QrCodeAbonneModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatMenuModule,         
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        TranslocoModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatToolbarModule,
        FuseCardModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatInputModule,
        MatDialogModule,
        MatOptionModule,
        MatSelectModule,MatSnackBarModule,
        MatNativeDateModule, MatMomentDateModule, TranslateModule,
        QrCodeAbonneModule

    ],
    providers: [TranslateService]
})
export class SharedModule
{
}
