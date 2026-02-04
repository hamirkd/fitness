import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { Media } from 'app/models/media.model';
import { MediaService } from 'app/core/services/media.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-media-add',
  templateUrl: './media-add.component.html',
  styleUrls: ['./media-add.component.scss']
})
export class MediaAddComponent implements OnInit {

  @Input() name;
  @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
data={}
    media: Media;
    action: 'edit' | 'new' = 'new';

    formFieldHelpers: string[] = [''];
    constructor(
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public matDialogRef: MatDialogRef<MediaAddComponent>,
        public mediaService: MediaService,private _snackBar: MatSnackBar,
    ) {
        this.media = new Media(_data.media); 
        this.mediaForm = this.createMediaForm();
    } 
    mediaForm: any;

    ngOnInit(): void {

       
    }
    /**
     * Create user form
     *
     * @returns {FormGroup}
     */parent_id:number
    
    createMediaForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.media.id],    
            parent_id: [this.media.parent_id],
            type_documents: [this.media.type_documents],
            libelle_document: [this.media.libelle_document],
            fichier: [this.media.id],
        });
    }
    
    onSubmit(fileList: FileList) {
        // Return if canceled
        if ( !fileList.length )
        {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png','application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const file = fileList[0];

        // Return if the file is not allowed
        if ( !allowedTypes.includes(file.type) )
        {
          this._snackBar.open(file.type+' Cette extension n\'est pas prise en charge '+allowedTypes, 'Splash', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration:12000
            });
            return;
        }
        this.data['btnsubmit'] = true;
        let media = this.mediaForm.getRawValue();
          this.mediaService.add(media,file).subscribe(data=>{
            this.data['btnsubmit'] = false;
            this._snackBar.open('Votre document a été sauvegardé', 'Splash', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration:2000});
              this.matDialogRef.close(this.mediaForm);
          },err=>{
            console.log(err)
            this.data['btnsubmit'] = false;
          }) 
      
  }
}
