<?php

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
|
| The first thing we will do is create a new Laravel application instance
| which serves as the "glue" for all the components of Laravel, and is
| the IoC container for the system binding all of the various parts.
|
*/

$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);
if (!function_exists('formatDateToFrench')) {
    function formatDateToFrench($date)
    {
        //setlocale(LC_TIME, 'french');
        $dateObject = DateTime::createFromFormat('Y-m-d', $date);
        if (!$dateObject) {
            return "Date invalide";
        }
        return strftime('%M %Y', $dateObject->getTimestamp());
    }
}
if (!function_exists('dateToPeriode')) {
    function dateToPeriode($dateParem) {
        // Création de l'objet DateTime
        $date = DateTime::createFromFormat('Y-m-d', $dateParem);

        // Récupération du premier jour du mois
        $dateDebutFormatee = $date->format('d-m-Y');

        // Clonage pour ne pas modifier l'original
        $dateFin = clone $date;

        // Aller au dernier jour du mois
        $dateFin->modify('last day of this month');
        $dateFinFormatee = $dateFin->format('d-m-Y');
        // Affichage de la période
        return "$dateDebutFormatee au $dateFinFormatee";
    }
}
/*
|--------------------------------------------------------------------------
| Bind Important Interfaces
|--------------------------------------------------------------------------
|
| Next, we need to bind some important interfaces into the container so
| we will be able to resolve them when needed. The kernels serve the
| incoming requests to this application from both the web and CLI.
|
*/

$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

/*
|--------------------------------------------------------------------------
| Return The Application
|--------------------------------------------------------------------------
|
| This script returns the application instance. The instance is given to
| the calling script so we can separate the building of the instances
| from the actual running of the application and sending responses.
|
*/

return $app;
