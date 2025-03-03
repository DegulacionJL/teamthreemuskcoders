<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Http\Controllers\calculateController;
use App\Http\Requests\API\calculator\calculateUserRequest;
use App\Services\calculateService;
use Mockery;
use Exception;

class CalculateControllerTest extends TestCase
{
    protected $calculateController;
    protected $calculateService;

    /**
     * Set up the test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->calculateService = Mockery::mock(calculateService::class);
        $this->calculateController = new calculateController($this->calculateService);
    }

    /**
     * Create a mock request with the given data.
     *
     * @param array $data
     * @return \Mockery\MockInterface
     */
    protected function createRequest(array $data)
    {
        $request = Mockery::mock(calculateUserRequest::class);
        $request->shouldReceive('input')->with('num1')->andReturn($data['num1']);
        $request->shouldReceive('input')->with('num2')->andReturn($data['num2']);
        $request->shouldReceive('validated')->andReturn($data);
        return $request;
    }

    /**
     * Test the addition method.
     */
    public function testValidAddition()
    {
        $this->calculateService->shouldReceive('addition')->with(10, 5)->andReturn(15);
        $request = $this->createRequest(['num1' => 10, 'num2' => 5]);
        $response = $this->calculateController->addition($request);
        $result = $response->getData()->result;
        $this->assertEquals(15, $result); // 1st assertion
    }

    /**
     * Test the subtraction method.
     */
    public function testValidSubtraction()
    {
        $this->calculateService->shouldReceive('subtraction')->with(10, 5)->andReturn(5);
        $request = $this->createRequest(['num1' => 10, 'num2' => 5]);
        $response = $this->calculateController->subtraction($request);
        $result = $response->getData()->result;
        $this->assertEquals(5, $result); // 2nd assertion
    }

    /**
     * Test the multiplication method.
     */
    public function testValidMultiplication()
    {
        $this->calculateService->shouldReceive('multiplication')->with(10, 5)->andReturn(50);
        $request = $this->createRequest(['num1' => 10, 'num2' => 5]);
        $response = $this->calculateController->multiplication($request);
        $result = $response->getData()->result;
        $this->assertEquals(50, $result); // 3rd assertion
    }

    /**
     * Test the division method.
     */
    public function testValidDivision()
    {
        $this->calculateService->shouldReceive('division')->with(10, 5)->andReturn(2);
        $request = $this->createRequest(['num1' => 10, 'num2' => 5]);
        $response = $this->calculateController->division($request);
        $result = $response->getData()->result;
        $this->assertEquals(2, $result); // 4th assertion
    }

    /**
     * Test the addition method with negative numbers.
     */
    public function testValidAdditionWithNegativeNumbers()
    {
        $this->calculateService->shouldReceive('addition')->with(-10, -5)->andReturn(-15);
        $request = $this->createRequest(['num1' => -10, 'num2' => -5]);
        $response = $this->calculateController->addition($request);
        $result = $response->getData()->result;
        $this->assertEquals(-15, $result); // 5th assertion
    }
    
    /**
     * Test the multiplication method with large numbers.
     */
    public function testValidMultiplicationWithLargeNumbers()
    {
        $this->calculateService->shouldReceive('multiplication')->with(100000, 100000)->andReturn(10000000000);
        $request = $this->createRequest(['num1' => 100000, 'num2' => 100000]);
        $response = $this->calculateController->multiplication($request);
        $result = $response->getData()->result;
        $this->assertEquals(10000000000, $result); // 6th assertion
    }

    /**
 * Test the division method with zero as the divisor.
 */
public function testDivisionByZero()
{
    $this->calculateService->shouldReceive('division')->with(10, 0)->andThrow(new \InvalidArgumentException('Division by zero'));
    $request = $this->createRequest(['num1' => 10, 'num2' => 0]);

    $response = $this->calculateController->division($request);
    $responseData = $response->getData();

    $this->assertEquals('Division by zero', $responseData->error); // 7th assertion
    $this->assertEquals(400, $response->status()); // 8th assertion
}
    
    /**
     * Tear down the test environment.
     */
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}