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
        return inertia('Order',['orders' => $orders]);
    }

    public function destroy(Request $request,$id)
{
    $order = Order::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

    DB::transaction(function () use ($order) {
        $order->orderDetails()->delete();
        $order->delete();
    });

    return redirect()->route('order')->with('success', 'Order deleted successfully!');
}

}
