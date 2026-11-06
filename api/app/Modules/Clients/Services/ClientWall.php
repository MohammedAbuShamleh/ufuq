<?php

namespace App\Modules\Clients\Services;

use App\Modules\Clients\Models\Client;
use App\Support\Translations;
use Illuminate\Database\Eloquent\Collection;

class ClientWall
{
    /** @return Collection<int, Client> */
    public function visible(): Collection
    {
        return Translations::shown(Client::visible()->with('media')->orderBy('sort_order')->get(), Client::REQUIRED_TEXT);
    }
}
