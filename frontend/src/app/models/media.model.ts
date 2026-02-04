export class Media {
    id:number
    parent_id:number
    type_documents:'DEPENSES'| 'SALAIRE'|'PROVISION'|'DOSSIERS_ELEVES'
    libelle_document:string 
    file_name:string 
    updated_by: string;
    created_by: string;
    updated_at: Date;
    created_at: Date;
    deleted_at: Date;
  
    constructor(media){
        this.id = media.id   
        this.type_documents = media.type_documents;
        this.libelle_document = media.libelle_document; 
        this.parent_id = media.parent_id; 
        this.file_name = media.file_name; 
        this.updated_by = media.updated_by;
        this.created_by = media.created_by;
        this.updated_at = media.updated_at;
        this.created_at = media.created_at;
        this.deleted_at = media.deleted_at;
    }
}
