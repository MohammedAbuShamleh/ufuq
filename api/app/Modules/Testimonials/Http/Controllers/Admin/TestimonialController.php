<?php

namespace App\Modules\Testimonials\Http\Controllers\Admin;

use App\Modules\Admin\Http\Requests\ReorderRequest;
use App\Modules\Testimonials\Http\Requests\Admin\SaveTestimonialRequest;
use App\Modules\Testimonials\Http\Resources\Admin\TestimonialResource;
use App\Modules\Testimonials\Models\Testimonial;
use App\Modules\Testimonials\Services\TestimonialEditor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/** Authorization is on the routes (TestimonialPolicy). */
class TestimonialController
{
    public function __construct(private readonly TestimonialEditor $testimonials) {}

    public function index(): AnonymousResourceCollection
    {
        return TestimonialResource::collection($this->testimonials->list());
    }

    public function store(SaveTestimonialRequest $request): JsonResponse
    {
        return TestimonialResource::make($this->testimonials->create($request->validated()))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Testimonial $testimonial): TestimonialResource
    {
        return TestimonialResource::make($this->testimonials->load($testimonial));
    }

    public function update(SaveTestimonialRequest $request, Testimonial $testimonial): TestimonialResource
    {
        return TestimonialResource::make($this->testimonials->update($testimonial, $request->validated()));
    }

    public function destroy(Testimonial $testimonial): Response
    {
        $this->testimonials->delete($testimonial);

        return response()->noContent();
    }

    public function reorder(ReorderRequest $request): Response
    {
        $this->testimonials->reorder($request->ids());

        return response()->noContent();
    }
}
