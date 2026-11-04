<?php

return [

    /*
    | The public API is read by ufuq.ps on the server, but the contact form posts
    | to /v1/leads straight from the visitor's browser, so the request keeps the
    | visitor's own address for throttling. Only the site's origin may do that.
    */

    'paths' => ['v1/*'],

    'allowed_methods' => ['GET', 'POST'],

    'allowed_origins' => array_filter(explode(',', (string) env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000'))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Accept', 'Content-Type'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => false,

];
