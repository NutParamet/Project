<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())->with('orderDetails.medicine')->get();
        return inertia('Orders/Index', compact('orders'));
    }

    public function placeOrder()
    {
        DB::transaction(function () {
            $cartItems = CartItem::where('user_id', Auth::id())->get();
            $totalPrice = $cartItems->sum(fn($item) => $item->medicine->price * $item->quantity);

            $order = Order::create([
                'user_id' => Auth::id(),
                'total_price' => $totalPrice,
                'status' => 'pending',
            ]);

            foreach ($cartItems as $item) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'medicine_id' => $item->medicine_id,
                    'quantity' => $item->quantity,
                    'price' => $item->medicine->price,
                ]);
            }

            CartItem::where('user_id', Auth::id())->delete();
        });

        return redirect()->route('orders.index')->with('success', 'Order placed successfully!');
    }
}
