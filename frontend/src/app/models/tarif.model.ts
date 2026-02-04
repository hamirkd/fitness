export class Tarif {

    id:number
    montant:string
    redevance:number
    autres_frais:number
    typetarif:number

    constructor(tarif) {
        this.id = tarif.id
        this.redevance = tarif.redevance
        this.montant = tarif.montant
        this.autres_frais = tarif.autres_frais
        this.typetarif = tarif.typetarif
    }
}
