/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Utilisateur } from 'app/models/utilisateur.model';

let user: Utilisateur;
if (localStorage.getItem('user'))
    user = JSON.parse(localStorage.getItem('user'));

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard',
        roles: 'ADMIN,USER,SECRETAIRE,DIRECTEUR'
    },
    {
        id: 'facturation',
        title: 'Abonnement',
        type: 'basic',
        icon: 'iconsmind:students',
        link: '/abonnement',
        roles: 'USER,ADMIN'
    },
    {
        id: 'client',
        title: 'Client',
        type: 'basic',
        icon: 'iconsmind:business_manwoman',
        link: '/client',
        roles: 'USER,ADMIN,SCOLARITE,DIRECTEUR,SECRETAIRE'
    },
    {
        id: 'utilisateur',
        title: 'utilisateur',
        type: 'basic',
        icon: 'heroicons_solid:users',
        link: '/utilisateur',
        roles: 'USER,ADMIN,SCOLARITE,DIRECTEUR'
    },
    {
        type: 'divider',
        roles: 'USER,ADMIN,SCOLARITE,DIRECTEUR,SECRETAIRE'
    }
];


defaultNavigation.push(
    {
        type: 'divider'
    })

export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard',
    },
    {
        id: 'pedagogie',
        title: 'pedagogie',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/pedagogie',
    },
    {
        id: 'scolarite',
        title: 'scolarite',
        type: 'basic',
        icon: 'heroicons_solid:database',
        link: '/scolarite',
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard',
    },
    {
        id: 'pedagogie',
        title: 'pedagogie',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/pedagogie',
    },
    {
        id: 'scolarite',
        title: 'scolarite',
        type: 'basic',
        icon: 'heroicons_solid:database',
        link: '/scolarite',
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard',
    },
    {
        id: 'pedagogie',
        title: 'pedagogie',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/pedagogie',
    },
    {
        id: 'scolarite',
        title: 'scolarite',
        type: 'basic',
        icon: 'heroicons_solid:database',
        link: '/scolarite',
    },
];
