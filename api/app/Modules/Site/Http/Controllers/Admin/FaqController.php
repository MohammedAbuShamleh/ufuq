<?php

namespace App\Modules\Site\Http\Controllers\Admin;

use App\Modules\Admin\Http\Requests\ReorderRequest;
use App\Modules\Site\Http\Requests\Admin\SaveFaqRequest;
use App\Modules\Site\Http\Resources\Admin\FaqResource;
use App\Modules\Site\Models\Faq;
use App\Modules\Site\Services\FaqEditor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/** Authorization is on the routes (FaqPolicy). */
class FaqController
{
    public function __construct(private readonly FaqEditor $faqs) {}

    public function index(): AnonymousResourceCollection
    {
        return FaqResource::collection($this->faqs->list());
    }

    public function store(SaveFaqRequest $request): JsonResponse
    {
        return FaqResource::make($this->faqs->create($request->validated()))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Faq $faq): FaqResource
    {
        return FaqResource::make($faq);
    }

    public function update(SaveFaqRequest $request, Faq $faq): FaqResource
    {
        return FaqResource::make($this->faqs->update($faq, $request->validated()));
    }

    public function destroy(Faq $faq): Response
    {
        $this->faqs->delete($faq);

        return response()->noContent();
    }

    public function reorder(ReorderRequest $request): Response
    {
        $this->faqs->reorder($request->ids());

        return response()->noContent();
    }
}
