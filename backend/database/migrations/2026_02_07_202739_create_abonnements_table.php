<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAbonnementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fit_abonnements', function (Blueprint $table) {
            $table->id();
            $table->integer('abonne_id')->nullable();
            $table->string('nom',50);
            $table->string('prenom',50);
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->integer('tarif_id')->nullable();
            $table->integer('duree')->default(0);
            $table->integer('montant')->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('created_by')->nullable();
            $table->dateTime('cancelled_at')->nullable();
            $table->string('motif',200)->nullable();
            $table->softDeletes();
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('abonnements');
    }
}
