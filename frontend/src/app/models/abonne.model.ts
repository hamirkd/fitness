export class Abonne {
    id:number
    nom:string
    prenom:string
    genre:'HOMME'|'FEMME';
    telephone:string ;
    file_name:string;
    email:string;
    datenais:any;
    observation:any;    
    numerocompteur:string;
    cnib:string;
    lieunais: string;

    
    updated_by:any;
    created_by:any;
    updated_at:any;
    created_at:any;
    userUpdate:any;
    userCreate:any;

    constructor(client){
        this.id = client.id
        this.nom = client.nom
        this.prenom = client.prenom
        this.genre = client.genre
        this.telephone = client.telephone
        this.email = client.email
        this.lieunais = client.lieunais
        this.datenais = client.datenais;
        this.observation = client.observation;
        this.cnib = client.cnib;
        this.file_name = client.file_name;
        this.updated_by = client.updated_by;
        this.created_by = client.created_by;
        this.updated_at = client.updated_at;
        this.created_at = client.created_at;
    }
}
