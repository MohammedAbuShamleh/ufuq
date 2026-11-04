<?php

return [

    /*
    | Two browser callers. The public site's contact form posts to /v1/leads
    | straight from the visitor's browser, so the request keeps the visitor's
    | own address for throttling. The dashboard SPA calls /admin/v1 with its
    | session cookie, so credentials are allowed.
    |
    | Allowing credentials is safe for every listed origin: a session is only
    | ever started for origins in SANCTUM_STATEFUL_DOMAINS (the dashboard), and
    | only on /admin/v1. The site's origin can send cookies, but no session is
    | read for it, and /v1 has no session at all.
    */

    'paths' => ['v1/*', 'admin/v1/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],

    'allowed_origins' => array_filter(explode(',', (string) env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000'))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Accept', 'Content-Type', 'X-XSRF-TOKEN', 'X-Requested-With'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => true,

];
