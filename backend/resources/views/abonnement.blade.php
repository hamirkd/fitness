<!doctype html>
<html lang="fr">

<head>
    <meta charset="utf-8" />
    <title>{{$title}} | ECAF FITNESS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="Ticket d'abonnement fitness" name="description" />
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
@foreach($abonnements as $data)
<div style="page-break-inside: avoid;">

<div style="
    max-width: 90mm;
    padding: 8px;
    font-family: Arial, sans-serif;
    border: 1px dashed #333;
    border-radius: 8px;
    font-size: 10px;
">
    <h3 style="text-align:center; margin-bottom:5px;">
        🎫 TICKET D’ABONNEMENT ECAF FITNESS
    </h3>

    <hr style="border:0.5px solid #000;">

    <table style="width:100%; border-collapse:collapse;">
        <tbody>
            <tr>
                <td><strong>Nom & Prénom(s)</strong></td>
                <td>{{$data->nom}} {{$data->prenom}}</td>
            </tr>
            <tr>
                <td><strong>Type d’abonnement</strong></td>
                <td>{{$data->tarif->libelle}}</td>
            </tr>
            <tr>
                <td><strong>Période</strong></td>
                <td>
                    Du {{ \Carbon\Carbon::parse($data->date_debut)->format('d/m/Y') }}
                    <br>
                    Au {{ \Carbon\Carbon::parse($data->date_fin)->format('d/m/Y') }}
                </td>
            </tr>
            <tr>
                <td><strong>Durée</strong></td>
                <td>{{$data->duree}} jour(s)</td>
            </tr>
            <tr>
                <td><strong>Montant</strong></td>
                <td>{{$data->montant}} FCFA</td>
            </tr>
            <tr style="background-color:#d4edda;">
                <td><strong>Statut</strong></td>
                <td><strong>{{$data->etat}}</strong></td>
            </tr>
            <tr>
                <td><strong>Date paiement</strong></td>
                <td>{{ \Carbon\Carbon::parse($data->date_paiement)->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td><strong>N° Ticket</strong></td>
                <td>{{$data->id}}/{{$data->tarif->code}}/{{$data->abonne_id}}</td>
            </tr>
        </tbody>
    </table>

    <hr style="border:0.5px solid #000; margin-top:6px;">

    <p style="text-align:center; font-size:9px; color:#555;">
        Ce ticket fait foi de preuve d’abonnement.<br>
        Présentez-le à l’entrée du club.
    </p>

    <p style="text-align:center; font-size:8px; color:#888;">
        ECAF FITNESS • Discipline • Performance • Santé
    </p>
</div>
</div>
@endforeach
</body>

</html>
