<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use HasFactory;
    use SoftDeletes;
    /**
    * @var array
    */
    protected $table = 'medias';
   protected $fillable = [
      'parent_id',
      'type_documents',
      'libelle_document',
      'file_name',
      'updated_by',
      'created_by',
      'updated_at',
      'created_at',
    ];
}