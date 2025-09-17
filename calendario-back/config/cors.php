<?php

require __DIR__ . '/../vendor/autoload.php';

//Cargar variables de entorno
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ );
$dotenv->load();

// Detectar entorno
$env = $_ENV['APP_ENV'] ?? 'dev';

// Origenes por entorno
$origins = [
    'dev' => explode(',', $_ENV['ALLOWED_ORIGINS_DEV']),
    'qa' => explode(',', $_ENV['ALLOWED_ORIGINS_QA']),
    // 'prod' => explode(',', $_ENV['ALLOWED_ORIGINS_PROD']), Descomentar cuando se tenga la URL de Produccion
    'prod' => [],
];

// $allowedOrigins = $origins[$env] ?? $origins['prod']; Descomentar cuando se tenga la URL de Produccion
$allowedOrigins = $origins[$env] ?? [];

// Validar si el origen de la petición esta permitido
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
}

// Manejo de Option
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

?>