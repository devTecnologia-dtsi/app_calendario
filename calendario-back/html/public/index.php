<?php

// Anti-Clickjacking
header("X-Frame-Options: SAMEORIGIN");
header("Content-Security-Policy: frame-ancestors 'self'");

header("X-Content-Type-Options: nosniff");         // Evita interpretación incorrecta de tipos MIME
header("X-XSS-Protection: 1; mode=block");         // Mitiga algunos ataques XSS en navegadores antiguos
header("Referrer-Policy: no-referrer-when-downgrade"); // Controla la info en la cabecera Referer
header("Permissions-Policy: geolocation=(), microphone=()"); // Limita APIs sensibles del navegador

// CORS
require __DIR__ ."/../../config/cors.php";

// Cargar las rutas de la API
require_once __DIR__ . "/../../src/routes/rutas.php";

?> 