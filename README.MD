### Projet de Récupération des Index et Génération des Factures d'Eau pour les Fontaines
#### Description
Ce projet a pour objectif de  **récupérer les index de consommation d'eau** des fontaines publiques et de générer automatiquement des factures d'eau. L'application permet de gérer la consommation d'eau pour chaque fontaine, de suivre les relevés des index de consommation, puis de générer des factures détaillées pour les utilisateurs ou les autorités responsables.
#### Fonctionnalités
- **Récupération des Index de Consommation** : L'application permet de récupérer les index de consommation des fontaines, qui peuvent être saisis manuellement.
- **Calcul Automatique des Factures** : En fonction de l'index de consommation, le système calcule automatiquement le montant à facturer pour chaque utilisateur ou chaque zone d'une fontaine.
- **Génération des Factures** : Une fois les calculs effectués, des factures détaillées sont générées au format PDF ou tout autre format requis.
- **Gestion des Utilisateurs** : Le système permet de gérer les utilisateurs ou les points de consommation d'eau, y compris l'historique de leurs relevés et factures.
- **Rapports** : Des rapports détaillés peuvent être générés pour permettre un suivi facile de la consommation d'eau et des factures associées.

### Démo
Tu peux voir une démo en direct de l'application en suivant ce lien :
[**Démo en direct**](http://geschool.ddns.net/facture-eau)

#### Technologies Utilisées
- **Langage de Programmation** : PHP, JavaScript (Angular, Node.js)
- **Base de Données** : MySQL / PostgreSQL
- **Outils de Génération de Factures** : PDFLib ou TCPDF pour la génération des factures au format PDF
- **Interface Utilisateur** : Angular pour l'interface web

#### Installation
### Prérequis
PHP 7.4 ou supérieur

Node.js (pour la partie frontend)

Serveur MySQL ou PostgreSQL

Composer (pour les dépendances PHP)

NPM (pour les dépendances frontend)

### Étapes d'Installation
1. Clonez le projet :
```bash
git clone https://github.com/votre-utilisateur/projet-fontaines.git
```
2. Installez les dépendances PHP :
```bash
cd projet-fontaines
composer install
```
3. Installez les dépendances frontend :
```bash
npm install
```
4. Configurez la base de données dans le fichier .env (exemple pour MySQL) :
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fontaines_db
DB_USERNAME=root
DB_PASSWORD=
```
5. Créez et migrez les tables de la base de données :
```bash
php artisan migrate
```
6. Démarrez le serveur de développement :
```bash
npm start
php artisan serve
```
7. Accédez à l'application via http://localhost:4200 (ou l'URL configurée).

### Utilisation
Récupérer un Index de Consommation
Connectez-vous à l'application avec votre identifiant et mot de passe.

Accédez à la section de nouvelle facture.
Choisissez la période et généré toutes les factures de la période.
Entrez les valeurs des index de consommation.

### Imprimer une facture
Allez dans la section "Facturations/Consultation de facture".

Cliquez sur "Imprimer" et le système imprimera la facture téléchargable en PDF. 

### Contribuer
Si vous souhaitez contribuer à ce projet, voici les étapes :

1. Forkez le projet.

2. Créez une branche pour vos fonctionnalités (git checkout -b feature/ma-fonction).

3. Effectuez vos modifications et commitez-les.

4. Poussez vos changements sur votre fork.

5. Soumettez une pull request.

Auteurs
Hamadou DAO - Développeur principal
