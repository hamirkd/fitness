import { Abonne } from "./abonne.model";
import { Tarif } from "./tarif.model";

export class Abonnement {
    id: string;
    abonne_id: string;
    nom: string;
    prenom: string;
    periode: string;
    date_debut: string;
    date_fin: string;
    duree: number;
    tarif_id: string;
    montant: string;
    remise: string;
    montanttotal: string;
    etat : string;
    datepaiement: string;
    updated_by: string;
    created_by: string;   
    abonne: Abonne;   
    tarif: Tarif;
    nomprenom: string;

    constructor(abonne:any){
        this.id = abonne.id;
        this.abonne_id = abonne.abonne_id;
        this.nom = abonne.nom;
        this.prenom = abonne.prenom;
        this.periode = abonne.periode;
        this.date_debut = abonne.date_debut;
        this.date_fin = abonne.date_fin;
        this.duree = abonne.duree;
        this.tarif_id = abonne.tarif_id;
        this.montant = abonne.montant;
        this.remise = abonne.remise;
        this.montanttotal = abonne.montanttotal;
        this.etat  = abonne.etat ;
        this.datepaiement = abonne.datepaiement;
        this.abonne = abonne.abonne;
        this.tarif = abonne.tarif;
        this.nomprenom = abonne.nomprenom;
        this.updated_by = abonne.updated_by;
        this.created_by = abonne.created_by;   
    }
}
