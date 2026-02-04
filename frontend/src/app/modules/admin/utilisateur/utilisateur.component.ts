import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UtilisateurService } from 'app/core/services/utilisateur.service';
import { UserService } from 'app/core/user/user.service';
import { Utilisateur } from 'app/models/utilisateur.model';
import { AddUtilisateurComponent } from './add-utilisateur/add-utilisateur.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-utilisateur',
    templateUrl: './utilisateur.component.html',
    styleUrls: ['./utilisateur.component.scss']
})
export class UtilisateurComponent implements OnInit {
    constructor(
        private _matDialog: MatDialog,
        private _utilisateurService: UtilisateurService,
        private _userService: UserService, private _snackBar: MatSnackBar
    ) {
        this._userService.user$.subscribe(user => { this.user = user; })
    }

    user: any
    searchControl: FormControl = new FormControl();
    dialogRef: any;

    dataSource: MatTableDataSource<Utilisateur> = new MatTableDataSource();

    displayedColumns: string[] = [
        'id',
        'last_name',
        'first_name',
        'email',
        'telephone',
        'role',
        'creation',
        'actions',
    ];

    recherche(textRecherche) {
        textRecherche = textRecherche.trim(); // Remove whitespace
        textRecherche = textRecherche.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = textRecherche;
    }
    ngOnInit(): void {
        this._updateDataSource();
    }

    _updateDataSource() {
        if (this.user.role == "ADMIN")
            this._utilisateurService.getAllForAdmin().subscribe(data => {
                this.dataSource.data = data;
            })
        else {
            this._utilisateurService.getAll().subscribe(data => {
                this.dataSource.data = data;
            })
        }
    }

    editer(utilisateur): void {
        this.dialogRef = this._matDialog.open(AddUtilisateurComponent, {
            panelClass: '',
            data: {
                utilisateur: utilisateur,
                action: 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                this._updateDataSource();
            });
    }

    ajouter(): void {
        this.dialogRef = this._matDialog.open(AddUtilisateurComponent, {
            panelClass: '',
            data: {
                utilisateur: {},
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                this._updateDataSource();
            });
    }

    supprimer(utilisateur) {
        this._utilisateurService.delete(utilisateur).subscribe(data => {
            this._updateDataSource();
        })
    }

    restore(utilisateur) {
        this._utilisateurService.restore(utilisateur).subscribe(data => {
            this._updateDataSource();
        })
    }

    reinitialiserMotDePasse(utilisateur) {
        this._utilisateurService.passeWord(utilisateur).subscribe(data => {
            this._snackBar.open("Le mot de passe a été reinitialiser, le mot de passe par defaut est [Digital@2023]", 'Splash', {
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 2000
            });
            this._updateDataSource();
        })
    }

}
