<?php

namespace Database\Factories;

use App\Models\CartItem;
use App\Models\User;
use App\Models\Medicine;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartItemFactory extends Factory
{
    /**
     * กำหนดชื่อของโมเดลที่ Factory นี้ใช้งาน
     *
     * @var string
     */
    protected $model = CartItem::class;

    /**
     * สร้างข้อมูลปลอม
     *
     * @return array
     */
    public function definition()
    {
        // return [
        //     'user_id' => User::factory(), // สร้าง user ใหม่โดยใช้ Factory
        //     'medicine_id' => Medicine::factory(), // สร้าง medicine ใหม่โดยใช้ Factory
        //     'quantity' => $this->faker->numberBetween(1, 10), // สุ่มจำนวนสินค้า 1-10
        //     'created_at' => now(), // ตั้งค่า created_at
        //     'updated_at' => now(), // ตั้งค่า updated_at
        // ];
    }
}
