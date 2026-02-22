<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableSceances extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fit_seances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('abonne_id')->constrained()->onDelete('cascade');
            $table->foreignId('abonnement_id')->constrained('fit_abonnements')->onDelete('cascade');

            $table->time('heure_debut');
            $table->time('heure_fin')->nullable();
            $table->date('date_seance');
            $table->enum('statut', ['EN_COURS', 'TERMINEE'])->default('EN_COURS');
            $table->timestamps();
            
            // Empêcher une double séance le même jour
            $table->unique(['abonne_id', 'date_seance']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fit_seances');
    }
}
