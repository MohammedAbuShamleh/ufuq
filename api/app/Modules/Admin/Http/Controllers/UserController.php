<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Models\User;
use App\Modules\Admin\Http\Requests\SaveUserRequest;
use App\Modules\Admin\Http\Resources\UserResource;
use App\Modules\Admin\Services\UserManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/** Authorization is on the routes (UserPolicy); the guards live in UserManager. */
class UserController
{
    public function __construct(private readonly UserManager $users) {}

    public function index(): AnonymousResourceCollection
    {
        return UserResource::collection($this->users->list());
    }

    public function store(SaveUserRequest $request): JsonResponse
    {
        return UserResource::make($this->users->create($request->validated()))
            ->response()
            ->setStatusCode(201);
    }

    /** The edit form opens on one account. */
    public function show(User $user): UserResource
    {
        return UserResource::make($user);
    }

    public function update(SaveUserRequest $request, User $user): UserResource
    {
        return UserResource::make($this->users->update($user, $request->validated(), $request->user()));
    }

    public function destroy(Request $request, User $user): Response
    {
        $this->users->delete($user, $request->user());

        return response()->noContent();
    }
}
