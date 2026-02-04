import { Client } from "./client.model";
import { Tarif } from "./tarif.model";

export class Facture {
    id: string;
    client_id: string;
    nom: string;
    prenom: string;
    periode: string;
    ancienindex: string;
    nouveauindex: string;
    consommation: string;
    prixunitaire: string;
    tarif_id: string;
    montant: string;
    redevance: string;
    montanttotal: string;
    etat : string;
    datepaiement: string;
    dateecheance: string;
    updated_by: string;
    created_by: string;   
    client: Client;   
    tarif: Tarif;
    typeclient: string;
    numerocompteur: string;   

    constructor(client){
        this.id = client.id;
        this.client_id = client.client_id;
        this.nom = client.nom;
        this.prenom = client.prenom;
        this.periode = client.periode;
        this.ancienindex = client.ancienindex;
        this.nouveauindex = client.nouveauindex;
        this.consommation = client.consommation;
        this.prixunitaire = client.prixunitaire;
        this.tarif_id = client.tarif_id;
        this.montant = client.montant;
        this.redevance = client.redevance;
        this.montanttotal = client.montanttotal;
        this.etat  = client.etat ;
        this.datepaiement = client.datepaiement;
        this.dateecheance = client.dateecheance;
        this.client = client.client;
        this.tarif = client.tarif;
        this.typeclient = client.typeclient;  
        this.numerocompteur = client.numerocompteur;
        this.updated_by = client.updated_by;
        this.created_by = client.created_by;   
    }
}
