<?php

/*
| Only the options that differ from the package defaults; the rest are merged
| in from vendor/spatie/laravel-medialibrary/config/media-library.php.
*/

return [

    // The dashboard accepts screen videos up to 60 MB (images 10 MB, the profile
    // PDF 20 MB); the request rules hold each kind to its own limit.
    'max_file_size' => 1024 * 1024 * 60,

];
