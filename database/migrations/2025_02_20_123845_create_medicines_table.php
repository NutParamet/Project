<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        if (!Schema::hasTable('medicines')) {
            Schema::create('medicines', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('brand');
                $table->text('description');
                $table->decimal('price', 10, 2);
                $table->unsignedBigInteger('category_id');
                $table->integer('stock_quantity');
                $table->string('image')->nullable();
                $table->timestamps();

                $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }

    public function decrementStock($quantity)
    {
        // ลดจำนวนสต็อกในฐานข้อมูล
        $this->stock_quantity -= $quantity;
        $this->save();  // บันทึกการเปลี่ยนแปลง
    }
};
