export class Utilisateur {
    id:number
    email:string
    password:string
    role:'ADMIN'|'SCOLARITE'|'USER'|'COMPTABLE'|'CAISSE'|'DIRECTEUR'='ADMIN'
    last_name:string
    first_name:string
    telephone:string 
    personnel_id:number 
    avatar:string 

    constructor(utilisateur){
        this.id = utilisateur.id
        this.email = utilisateur.email
        this.password = utilisateur.password
        this.last_name = utilisateur.last_name
        this.first_name = utilisateur.first_name
        this.telephone = utilisateur.telephone
        this.personnel_id = utilisateur.personnel_id
        this.role = utilisateur.role
        this.avatar = utilisateur.avatar
    }
}
