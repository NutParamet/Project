<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    // อ่าน (Read)
    public function index()
    {
        $cartItems = CartItem::where('user_id', auth()->id())->with('medicine')->get();

        if ($cartItems->isEmpty()) {
            return Inertia::render('Shop/Cart', [
                'cartItems' => [],
                'message' => 'Your cart is empty.',
            ]);
        }

        return Inertia::render('Shop/Cart', [
            'cartItems' => $cartItems,
        ]);
    }

    // สร้าง (Create)
    public function store(Request $request)
{
    $validated = $request->validate([
        'medicine_id' => 'required|exists:medicines,id',
        'quantity' => 'required|integer|min:1',
    ]);

    $existingItem = CartItem::where('user_id', auth()->id())
        ->where('medicine_id', $request->medicine_id)
        ->first();

    if ($existingItem) {
        // ถ้ามีสินค้านี้แล้ว จะอัปเดตจำนวนสินค้า
        $existingItem->update([
            'quantity' => $existingItem->quantity + $request->quantity,
        ]);
    } else {
        // ถ้ายังไม่มีสินค้า จะสร้างสินค้าใหม่ในตะกร้า
        CartItem::create([
            'user_id' => auth()->id(),
            'medicine_id' => $request->medicine_id,
            'quantity' => $request->quantity,
        ]);
    }

    return Inertia::render('Shop/Cart', [
        'cartItems' => CartItem::where('user_id', auth()->id())
            ->with('medicine') // ดึงข้อมูล medicine
            ->get(),
        'message' => 'Item added to cart.',
    ]);
}

public function update(Request $request, $id)
{
    // Find the cart item by ID and update the quantity
    $cartItem = CartItem::where('medicine_id', $id)->where('user_id', auth()->id())->first();

    if ($cartItem) {
        $cartItem->update([
            'quantity' => $request->input('quantity')
        ]);
        return redirect()->route('cart.index');
    }

    return response()->json(['message' => 'Item not found'], 404);
}

public function delete(Request $request, $id)
{
    // ใช้ auth()->id() แทน user_id ที่มาจาก request
    $cartItem = CartItem::where('medicine_id', $id)
                        ->where('user_id', auth()->id()) // ใช้ auth()->id() แทน
                        ->first();
    if ($cartItem) {
        // ลบ item จากตะกร้า
        $cartItem->delete();
        return redirect()->route('cart.index');
    }

    // ถ้าไม่พบ item
    return response()->json(['message' => 'Item not found'], 404);
}

}
