<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAbonnesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('abonnes', function (Blueprint $table) {
            $table->id();
            $table->string('nom',50);
            $table->string('prenom',50);
            $table->date('datenais')->nullable();
            $table->string('lieunais',50)->nullable();
            $table->string('telephone',50)->nullable();
            $table->string('email',50)->nullable();
            $table->string('observation',200)->nullable();
            $table->enum('genre', ['HOMME', 'FEMME', 'NONPRECIS']); 
            $table->string('file_name',255);
            $table->string('cnib',30)->nullable();
            $table->integer('updated_by')->nullable();
            $table->integer('created_by')->nullable();
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
        Schema::dropIfExists('abonnes');
    }
}
