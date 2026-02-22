<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToAbonnements extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fit_abonnements', function (Blueprint $table) {
            $table->string('mode_paiement', 255)->nullable();
            $table->string('etat', 255)->nullable();
            $table->date('date_pause')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fit_abonnements', function (Blueprint $table) {
            $table->dropColumn('mode_paiement');
            $table->dropColumn('date_pause');
            $table->dropColumn('etat');
        });
    }
}
