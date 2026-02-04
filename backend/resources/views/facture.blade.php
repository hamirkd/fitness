<!doctype html>
<html lang="fr">

<head>
    <meta charset="utf-8" />
    <title>{{$title}} | GESCHOOL BURKINA FASO</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="Une application innovante qui permet la gestion de vos factures" name="description" />
    <meta content="DAO Hamadou" name="author" />
    <link rel="shortcut icon" href="{{ URL::asset('assets/images/logo.png') }}" type="image/x-icon">

    <style> 
        @page {
            margin-top: 10px;
            margin-bottom: 5px;
        }

       
    </style>
</head>

<body>
    @foreach($factures as $data)
    <div style="page-break-inside: avoid;">

    <div style="max-width: 105mm; max-height: 148mm; padding: 1%; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 5px; font-size: 10px;">
    <h3 style="text-align: center; color: #333; margin-bottom: 5px;">Facture de Consommation d'Eau</h3>
    <hr style="border: 0.5px solid #000;">

    <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
        <tbody>
            <tr>
                <td><strong>Nom & Prénom(s) :</strong></td>
                <td>{{$data->nom}} {{$data->prenom}}</td>
            </tr>
            <tr>
                <td><strong>N° Compteur :</strong></td>
                <td>{{$data->numerocompteur}}</td>
            </tr>
            <tr>
                <td><strong>Période :</strong></td>
                <td>{{dateToPeriode($data->periode) }}

                 
                </td>
            </tr>
            <tr>
                <td><strong>Ancien Index :</strong></td>
                <td>{{$data->ancienindex}}</td>
            </tr>
            <tr>
                <td><strong>Nouveau Index :</strong></td>
                <td>{{$data->nouveauindex}}</td>
            </tr>
            <tr>
                <td><strong>Consommation :</strong></td>
                <td>{{$data->consommation}} m³</td>
            </tr>
            <tr>
                <td><strong>Montant :</strong></td>
                <td>{{$data->montant}} FCFA</td>
            </tr>
            <tr>
                <td><strong>Redevance :</strong></td>
                <td>{{$data->redevance}} FCFA</td>
            </tr>
            <tr style="background-color: #f8d7da;">
                <td><strong>Montant Net :</strong></td>
                <td><strong>{{$data->montanttotal}} FCFA</strong></td>
            </tr>
            <tr>
                <td><strong>État :</strong></td>
                <td>{{$data->etat}}</td>
            </tr>
            <tr>
                <td><strong>Date Paiement :</strong></td>
                <td>{{$data->datepaiement}}</td>
            </tr>
        </tbody>
    </table>

    <hr style="border: 0.5px solid #000; margin-top: 5px;">
    <p style="text-align: center; font-size: 9px; color: #666;">
        Merci de votre confiance ! Pour toute réclamation, contactez-nous.
    </p>
</div>
    </div>
    @endforeach
</body>

</html>