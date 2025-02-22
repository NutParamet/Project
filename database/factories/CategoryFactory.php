<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $medicineNames = [
            'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Omeprazole', 'Loratadine',
            'Cetirizine', 'Aspirin', 'Metformin', 'Atorvastatin', 'Simvastatin',
            'Losartan', 'Amlodipine', 'Levothyroxine', 'Metoprolol', 'Pantoprazole',
            'Prednisone', 'Albuterol', 'Gabapentin', 'Hydrochlorothiazide', 'Sertraline'
        ];
        return [
            'name' => $this->faker->randomElement($medicineNames),
        ];
    }
}
