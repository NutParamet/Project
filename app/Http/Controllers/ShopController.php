<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Medicine;
use App\Models\Category;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;

class ShopController extends Controller
{
    public function index()
    {
        $medicines = Medicine::with('category')->get();
        $categories = Category::all();
        return inertia('Shop/Index', compact('medicines', 'categories'));
    }

    public function addToCart(Request $request, $id)
    {
        $medicine = Medicine::findOrFail($id);

        $cartItem = CartItem::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'medicine_id' => $medicine->id
            ],
            [
                'quantity' => $request->input('quantity', 1)
            ]
        );

        return redirect()->route('shop.index')->with('success', 'Added to cart!');
    }
}
