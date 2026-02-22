import { Abonne } from "./abonne.model";
import { Tarif } from "./tarif.model";

export class Abonnement {
    id: string;
    abonne_id: string;
    nom: string;
    prenom: string;
    date_debut: string;
    date_fin: string;
    duree: number;
    tarif_id: number;
    montant: number;
    remise: string;
    montanttotal: string;
    etat : string;
    updated_by: string;
    created_by: string;   
    abonne: Abonne;   
    tarif: Tarif;
    nomprenom: string;
    cancelled_at: string;
    mode_paiement: string;
    date_pause: string;

    constructor(abonnement:any){
        this.id = abonnement.id;
        this.abonne_id = abonnement.abonne_id;
        this.nom = abonnement.nom;
        this.prenom = abonnement.prenom;
        this.date_debut = abonnement.date_debut;
        this.date_fin = abonnement.date_fin;
        this.duree = abonnement.duree;
        this.tarif_id = abonnement.tarif_id;
        this.montant = abonnement.montant;
        this.remise = abonnement.remise;
        this.montanttotal = abonnement.montanttotal;
        this.abonne = abonnement.abonne;
        this.etat = abonnement.etat;
        this.tarif = abonnement.tarif;
        this.nomprenom = abonnement.nom + ' ' + abonnement.prenom;
        this.updated_by = abonnement.updated_by;
        this.created_by = abonnement.created;   
        this.cancelled_at = abonnement.cancelled_at;   
        this.mode_paiement = abonnement.mode_paiement;   
        this.date_pause = abonnement.date_pause;
    }
}
