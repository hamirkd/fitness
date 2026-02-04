<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacturesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('factures', function (Blueprint $table) {
            $table->id();
            $table->integer('client_id')->nullable();
            $table->string('nom',50);
            $table->string('prenom',50);
            $table->string('numerocompteur',50);
            $table->string('typeclient',50);
            $table->date('periode');
            $table->integer('ancienindex')->nullable();
            $table->integer('nouveauindex')->nullable();
            $table->integer('consommation')->nullable();
            $table->integer('prixunitaire')->nullable();
            $table->integer('tarif_id')->nullable();
            $table->integer('montant')->nullable();
            $table->integer('redevance')->nullable();
            $table->integer('montanttotal')->nullable();
            $table->enum('etat', ['NONPAYE','PAYE',  'ANNULE']); 
            $table->datetime('datepaiement')->nullable();
            $table->date('dateecheance')->nullable();
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
        Schema::dropIfExists('factures');
    }
}
