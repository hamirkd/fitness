import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeanceService } from 'app/core/services/seance.service';

@Component({
  selector: 'app-qrcode-seance-participation',
  templateUrl: './qrcode-seance-participation.component.html',
  styleUrls: ['./qrcode-seance-participation.component.scss']
})
export class QrcodeSeanceParticipationComponent implements OnInit {
  @ViewChild('seanceNgForm') seanceNgForm: NgForm;
  @Input('verification') verification = true;
  seanceForm: FormGroup;
  isLoading = false;
  abonneInfo: any = null;
  constructor(
    private formBuilder: FormBuilder,
    private seanceService: SeanceService,
    private snackBar: MatSnackBar) { }

    ngOnInit(): void {
      this.initForm();
    }
  
    initForm(): void {
      this.seanceForm = this.formBuilder.group({
        telephone: ['', [Validators.required, Validators.minLength(8)]]
      });
    }
  
    participer(): void {
      if (this.seanceForm.invalid) {
        return;
      }
  
      this.isLoading = true;
      this.seanceForm.disable();
  
      const telephone = this.seanceForm.get('telephone')?.value;
  
      this.seanceService.participer(telephone).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.seanceForm.enable();
          
          if (response.success) {
            this.abonneInfo = response.data;
            this.showNotification('Participation enregistrée avec succès!', 'success');
            this.resetForm();
          } else {
            this.showNotification(response.message || 'Erreur lors de la participation', 'error');
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.seanceForm.enable();
          
          const message = error.error?.message || 'Erreur de connexion au serveur';
          this.showNotification(message, 'error');
          
          if (error.status === 404) {
            this.seanceForm.get('telephone')?.setErrors({ notFound: true });
          }
        }
      });
    }
  
    resetForm(): void {
      this.seanceForm.reset();
      this.seanceNgForm.resetForm();
    }
  
    private showNotification(message: string, type: 'success' | 'error'): void {
      this.snackBar.open(message, 'Fermer', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: type === 'success' ? ['bg-green-500', 'text-white'] : ['bg-red-500', 'text-white']
      });
    }

}
