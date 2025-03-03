<?php

namespace App\Services;

use App\Models\calculateModel;

class calculateService
{
    protected $calculateModel;

    public function __construct(calculateModel $calculateModel)
    {
        $this->calculateModel = $calculateModel;
    }
    
    /**
     * Calculate the sum of two numbers and save it to the database.
     */
    public function addition(float $num1, float $num2): float
    {
        $result = $num1 + $num2;

        // Save the sum to the database
        $this->calculateModel->create([
            'num1' => $num1,
            'num2' => $num2,
            'result' => $result,
        ]);

        return $result;
    }

    public function subtraction(int $num1, int $num2): int
    {
        $result = $num1 - $num2;

        // Save the sum to the database
        $this->calculateModel->create([
            'num1' => $num1,
            'num2' => $num2,
            'result' => $result,
        ]);

        return $result;
    }

    public function multiplication(int $num1, int $num2): int
    {
        $result = $num1 * $num2;

        // Save the sum to the database
        $this->calculateModel->create([
            'num1' => $num1,
            'num2' => $num2,
            'result' => $result,
        ]);

        return $result;
    }

    public function division(float $num1, float $num2): float
    {
        if ($num2 == 0) {
            throw new \InvalidArgumentException('Division by zero');
        }

        $result = $num1 / $num2;

        // Save the result to the database
        $this->calculateModel->create([
            'num1' => $num1,
            'num2' => $num2,
            'result' => $result,
        ]);

        return $result;
    }
}