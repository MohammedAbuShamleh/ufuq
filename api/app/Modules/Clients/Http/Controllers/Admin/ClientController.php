<?php

namespace App\Modules\Clients\Http\Controllers\Admin;

use App\Modules\Admin\Http\Requests\ReorderRequest;
use App\Modules\Clients\Http\Requests\Admin\SaveClientRequest;
use App\Modules\Clients\Http\Resources\Admin\ClientResource;
use App\Modules\Clients\Models\Client;
use App\Modules\Clients\Services\ClientEditor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/** Authorization is on the routes (ClientPolicy). */
class ClientController
{
    public function __construct(private readonly ClientEditor $clients) {}

    public function index(): AnonymousResourceCollection
    {
        return ClientResource::collection($this->clients->list());
    }

    public function store(SaveClientRequest $request): JsonResponse
    {
        return ClientResource::make($this->clients->create($request->validated()))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Client $client): ClientResource
    {
        return ClientResource::make($client->load('media'));
    }

    public function update(SaveClientRequest $request, Client $client): ClientResource
    {
        return ClientResource::make($this->clients->update($client, $request->validated()));
    }

    public function destroy(Client $client): Response
    {
        $this->clients->delete($client);

        return response()->noContent();
    }

    public function reorder(ReorderRequest $request): Response
    {
        $this->clients->reorder($request->ids());

        return response()->noContent();
    }
}
