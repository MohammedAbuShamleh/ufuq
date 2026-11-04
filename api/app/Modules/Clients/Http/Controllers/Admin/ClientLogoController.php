<?php

namespace App\Modules\Clients\Http\Controllers\Admin;

use App\Modules\Clients\Http\Requests\Admin\UploadLogoRequest;
use App\Modules\Clients\Http\Resources\Admin\ClientResource;
use App\Modules\Clients\Models\Client;
use App\Modules\Clients\Services\ClientEditor;

/** Authorization is on the routes (ClientPolicy::update). */
class ClientLogoController
{
    public function __construct(private readonly ClientEditor $clients) {}

    public function store(UploadLogoRequest $request, Client $client): ClientResource
    {
        return ClientResource::make($this->clients->setLogo($client, $request->file('logo')));
    }

    public function destroy(Client $client): ClientResource
    {
        return ClientResource::make($this->clients->removeLogo($client));
    }
}
