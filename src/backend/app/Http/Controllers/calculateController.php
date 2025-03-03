<?php

namespace App\Http\Controllers;

use Exception;
use App\Http\Requests\API\calculator\calculateUserRequest;
use App\Http\Controllers\Controller;
use App\Services\calculateService;
use App\Http\Resources\calculateResource;
use Illuminate\Http\JsonResponse;

class CalculateController extends Controller
{
    protected $calculatorService;

    public function __construct(calculateService $calculateService)
    {
        $this->calculatorService = $calculateService;
    }

    public function addition(calculateUserRequest $request):JsonResponse
    {
        $this->response = ['code' => 200]; // Initialize response with default code

        try {
            $request->validated();

            $num1 = $request->input('num1');
            $num2 = $request->input('num2');
            $result = $this->calculatorService->addition($num1, $num2);
        } catch (Exception $e) { //@codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } //@codeCoverageIgnoreEnd

        return response()->json(new calculateResource((object) ['result' => $result]));
    }

    public function subtraction(calculateUserRequest $request):JsonResponse
    {
        $this->response = ['code' => 200]; // Initialize response with default code

        try {
            $request->validated();

            $num1 = $request->input('num1');
            $num2 = $request->input('num2');
            $result =$this->calculatorService->subtraction($num1, $num2);

           
        } catch (Exception $e) { //@codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } //@codeCoverageIgnoreEnd

        return response()->json(new calculateResource((object) ['result' => $result]));
    }

    public function multiplication(calculateUserRequest $request):JsonResponse
    {
        $this->response = ['code' => 200]; // Initialize response with default code
        try {
            $request->validated();
            $num1 = $request->input('num1');
            $num2 = $request->input('num2');
            $result = round($this->calculatorService->multiplication($num1, $num2), 2);


        } catch (Exception $e) { //@codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } //@codeCoverageIgnoreEnd

        return response()->json(new calculateResource((object) ['result' => $result]));
    }

    
    public function division(calculateUserRequest $request): JsonResponse
{
    try {
        $request->validated();

        $num1 = $request->input('num1');
        $num2 = $request->input('num2');
        $result = round($this->calculatorService->division($num1, $num2), 2);

        return response()->json(['result' => $result]);
    } catch (\InvalidArgumentException $e) { 
        return response()->json(['error' => $e->getMessage()], 400);
        
    }}
}