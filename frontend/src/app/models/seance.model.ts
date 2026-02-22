export class Seance {
    id:number
    montant:string
    duree:number
    code:string
    libelle:string
    constructor(tarif: any) {
        this.id = tarif.id
        this.duree = tarif.duree
        this.montant = tarif.montant
        this.code = tarif.code
        this.duree = tarif.duree
        this.libelle = tarif.libelle
    }
}
