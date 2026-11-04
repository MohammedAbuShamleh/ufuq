<?php

namespace App\Modules\Site\Http\Controllers\Admin;

use App\Modules\Site\Http\Requests\Admin\UpdateSettingsRequest;
use App\Modules\Site\Http\Requests\Admin\UploadProfilePdfRequest;
use App\Modules\Site\Http\Resources\Admin\SettingsFormResource;
use App\Modules\Site\Services\SettingsEditor;

/** Authorization is on the routes (SettingPolicy, admin only). Every action answers with the whole form. */
class SettingsController
{
    public function __construct(private readonly SettingsEditor $settings) {}

    public function show(): SettingsFormResource
    {
        return SettingsFormResource::make($this->settings->all());
    }

    public function update(UpdateSettingsRequest $request): SettingsFormResource
    {
        return SettingsFormResource::make($this->settings->update($request->validated()));
    }

    public function storeProfilePdf(UploadProfilePdfRequest $request): SettingsFormResource
    {
        return SettingsFormResource::make($this->settings->setProfilePdf($request->file('file')));
    }

    public function destroyProfilePdf(): SettingsFormResource
    {
        return SettingsFormResource::make($this->settings->removeProfilePdf());
    }
}
