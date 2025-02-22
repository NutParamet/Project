<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use App\Models\Mesicine;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Medicine>
 */
class MedicineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{

    $this->faker->locale('en_US');
    $imageUrl = 'https://via.placeholder.com/150';  // Fallback image

    try {
        // สุ่มหน้า (page) ระหว่าง 1 ถึง 20
        $randomPage = $this->faker->numberBetween(1, 20);

        $response = Http::withHeaders([
            'Authorization' => env('PEXELS_API_KEY'), // ตรวจสอบว่า API key ถูกตั้งค่าใน .env
        ])->get('https://api.pexels.com/v1/search', [
            'query' => 'pill', // คำค้นหา
            'per_page' => 1,       // ดึงเพียง 1 รูปต่อหน้า
            'page' => $randomPage, // สุ่มหน้า
        ]);

        if ($response->successful()) {
            $data = $response->json();
            if (!empty($data['photos'])) {
                // ใช้ URL ของภาพขนาดกลาง (medium) จาก Pexels API
                $imageUrl = $data['photos'][0]['src']['medium'];
            }
        }
    } catch (\Exception $e) {
        // Log ข้อผิดพลาดหากเกิดปัญหา
        \Log::error('Failed to fetch image from Pexels: ' . $e->getMessage());
    }

    $medicineNames = [
        'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Omeprazole', 'Loratadine',
        'Cetirizine', 'Aspirin', 'Metformin', 'Atorvastatin', 'Simvastatin',
        'Losartan', 'Amlodipine', 'Levothyroxine', 'Metoprolol', 'Pantoprazole',
        'Prednisone', 'Albuterol', 'Gabapentin', 'Hydrochlorothiazide', 'Sertraline'
    ];

    // รายการยี่ห้อยา (ตัวอย่าง)
    $brandNames = [
        'Pfizer', 'Novartis', 'Roche', 'Merck', 'Johnson & Johnson',
        'Sanofi', 'AbbVie', 'GSK', 'Bayer', 'Gilead Sciences',
        'AstraZeneca', 'Eli Lilly', 'Amgen', 'Bristol-Myers Squibb', 'Takeda',
        'Biogen', 'Teva', 'Boehringer Ingelheim', 'Astellas', 'Daiichi Sankyo'
    ];

    $name = $this->faker->randomElement($medicineNames);

    return [
        'name' => $this->faker->randomElement($medicineNames), // สุ่มชื่อยาจากรายการ
        'brand' => $this->faker->randomElement($brandNames), // สุ่มยี่ห้อยาจากรายการ
        'description' => $this->faker->paragraph(),
        'price' => $this->faker->randomFloat(2, 10, 100),
        'category_id' => Category::factory(),
        'stock_quantity' => $this->faker->numberBetween(1, 100),
        'image' => $imageUrl,  // ใช้ URL ของภาพจาก Pexels หรือ fallback image
    ];
}
}
