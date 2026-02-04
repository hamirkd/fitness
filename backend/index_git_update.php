<?php 
$url = 'https://codeload.github.com/hamirkd/v2.api.paongo-trading.com/zip/refs/heads/main'; 
$fichier_nom = basename($url);
$fichier_contenu = file_get_contents($url);
$dossier_enregistrement = "/";

if(file_put_contents($fichier_nom, $fichier_contenu)) 
{ 
    echo "Fichier téléchargé avec succès"; 
} 
else 
{ 
    echo "Fichier non téléchargé"; 
} 
?> 