export class Versement {
    id?:number;
   inscription_id:number;
   eleve_id:number;
   annee_id:number;
   scolarite_id:number;
   montant:number;
   dateversement
   updated_by: string;
   created_by: string;
   updated_at: Date;
   created_at: Date;
    constructor(versement) {
        this.id = versement.id;
        this.inscription_id = versement.inscription_id;
        this.eleve_id = versement.eleve_id;
        this.annee_id = versement.annee_id;
        this.scolarite_id = versement.scolarite_id;
        this.montant = versement.montant;
        this.dateversement = versement.dateversement;
        this.updated_by = versement.updated_by;
        this.created_by = versement.created_by;
        this.updated_at = versement.updated_at;
        this.created_at = versement.created_at;
    }
    
}
