<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Medicine;
use App\Models\User;
use App\Models\Category;

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

public function createOrder(Request $request)
{
    // ดึงรายการสินค้าจากตะกร้าของผู้ใช้งานที่เข้าสู่ระบบ
    $cartItems = CartItem::where('user_id', auth()->id())->with('medicine')->get();

    if ($cartItems->isEmpty()) {
        session()->flash('error', 'Your cart is empty.');
        return redirect()->route('cart.index');
    }

    // ตรวจสอบปริมาณสต็อกก่อนทำการสร้างคำสั่งซื้อ
    foreach ($cartItems as $cartItem) {
        if ($cartItem->medicine->stock_quantity < $cartItem->quantity) {
            session()->flash('error', "Not enough stock for {$cartItem->medicine->name}. Only {$cartItem->medicine->stock_quantity} available.");
            return redirect()->route('cart.index');
        }
    }

    // คำนวณราคารวมของคำสั่งซื้อ
    $totalPrice = $cartItems->sum(function ($cartItem) {
        return $cartItem->medicine->price * $cartItem->quantity;
    });

    // สร้างคำสั่งซื้อใหม่
    $order = Order::create([
        'user_id' => auth()->id(),
        'total_price' => $totalPrice,
        'status' => 'pending', // เปลี่ยนสถานะตามการทำงานของคุณ
    ]);

    // สร้างรายละเอียดของคำสั่งซื้อและลดจำนวนสต็อก
    foreach ($cartItems as $cartItem) {
        OrderDetail::create([
            'order_id' => $order->id,
            'medicine_id' => $cartItem->medicine_id,
            'quantity' => $cartItem->quantity,
            'price' => $cartItem->medicine->price,
        ]);

        // ลดจำนวนสต็อกโดยตรงในที่นี้
        $cartItem->medicine->update([
            'stock_quantity' => $cartItem->medicine->stock_quantity - $cartItem->quantity
        ]);
    }

    // ลบรายการสินค้าจากตะกร้าเมื่อคำสั่งซื้อเสร็จสมบูรณ์
    CartItem::where('user_id', auth()->id())->delete();

    session()->flash('success', 'Order placed successfully!');
    return redirect()->route('order');
}

}
