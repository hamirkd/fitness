export class Seance {
    id: number;
    date_seance: string;
    nomprenom: string;
    heure_debut: string;
    heure_fin: string;
    abonne_id: number;
    constructor(seance: any) {
        this.id = seance.id
        if (seance.abonne) {
            this.nomprenom = seance.abonne.nom + ' ' + seance.abonne.prenom;
        }
        this.date_seance = seance.date_seance;
        this.heure_debut = seance.heure_debut;
        this.heure_fin = seance.heure_fin;
        this.abonne_id = seance.abonne_id;
    }
}
