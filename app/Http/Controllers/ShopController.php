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

        return inertia('Shop/Index', [
            'medicines' => $medicines,
            'categories' => $categories,
            'auth' => auth()->check(),
            'userId' => auth()->id(),
        ]);
    }
}
