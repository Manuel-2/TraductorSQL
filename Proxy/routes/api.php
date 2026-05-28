<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::post('/select', function (Request $request) {
    $raw = $request->getContent();

    try {
        $results = DB::select($raw);
        return response()->json([
            'data' => $results,
            'message' => "Query OK | " . count($results) . " resultados."
        ]);
    } catch (\Throwable $th) {
        return response()->json([
            'message' => $th->getMessage()
        ]);
    }
});

Route::post('/ddl', function (Request $request) {
    $raw = $request->getContent();

    try {
        DB::unprepared($raw);

        return response()->json([
            'message' => 'Query OK | DDL ejecutado en la base de datos.'
        ]);
    } catch (\Throwable $th) {
        return response()->json([
            'message' => 'Bad query | La base de datos real rechazo el query.'
        ]);
    }
});

Route::post('/clean', function () {
    try {
        clear();
        return response()->json([
            'message' => "Base de datos limpiada",
        ]);
    } catch (\Throwable $th) {
        return response()->json([
            'message' => "Fallo al limpiar la base de datos.",
        ]);
    }
});

function clear()
{
    $database = env('DB_DATABASE');

    // cerrar conexión actual
    DB::purge('mysql');

    // copiar config actual
    $config = config('database.connections.mysql');

    // usar DB del sistema
    $config['database'] = 'mysql';

    // crear conexión temporal
    config([
        'database.connections.temp' => $config
    ]);

    $conn = DB::connection('temp');

    // borrar y recrear
    $conn->statement("DROP DATABASE `$database`");

    $conn->statement("
        CREATE DATABASE `$database`
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_general_ci
    ");

    return response()->json([
        'success' => true
    ]);
}
