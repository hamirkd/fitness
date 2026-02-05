<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTarifsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::dropIfExists('tarifs');
        Schema::create('tarifs', function (Blueprint $table) {
            $table->id();
            $table->string('code',255);
            $table->string('libelle',255);
            $table->integer('montant')->default(0);
            $table->integer('duree')->default(0);
            $table->integer('updated_by')->nullable();
            $table->integer('created_by')->nullable();
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
        Schema::dropIfExists('tarifs');
        Schema::create('tarifs', function (Blueprint $table) {
            $table->id();
            $table->enum('typetarif', ['ENTREPRISE', 'ORDINAIRE'])->nullable();
            $table->integer('montant')->default(0);
            $table->integer('redevance')->default(0);
            $table->integer('autres_frais')->default(0);
            $table->integer('updated_by')->nullable();
            $table->integer('created_by')->nullable();
            $table->timestamps();
        });
    }
}
