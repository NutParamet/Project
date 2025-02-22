import React, { useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import Navbar from "@/Components/Navbar";
import NavbarForAuth from "@/Components/NavbarForAuth";
import { router } from '@inertiajs/react';

const Cart = ({ cartItems, auth, userId }) => {
    const [cartQuantities, setCartQuantities] = useState({});

    const handleQuantityChange = (medicineId, quantity) => {
        setCartQuantities(prevQuantities => ({
            ...prevQuantities,
            [medicineId]: quantity,
        }));
    };

    const updateCartItem = (medicineId) => {
        const quantity = cartQuantities[medicineId] || 1;
        const formData = {
            user_id: userId,
            medicine_id: medicineId,
            quantity: quantity,
        };

        router.put(`/cart/update/${medicineId}`, formData, {
            onSuccess: (data) => {
                setCartQuantities(prevQuantities => ({
                    ...prevQuantities,
                    [medicineId]: data.updatedQuantity,
                }));
                console.log("Cart updated successfully!");
            },
            onError: (errors) => {
                console.error("Error updating cart:", errors);
            }
        });
    };

    const removeFromCart = (medicineId) => {
        router.delete(`/cart/delete/${medicineId}`, {
            onSuccess: () => {
                console.log("Item removed from cart!");
            },
            onError: (errors) => {
                console.error("Error removing item from cart:", errors);
            }
        });
    };

    return (
        <div className="cart-container bg-gray-50 min-h-screen">
            {auth ? <NavbarForAuth /> : <Navbar />}

            <div className="cart-items mt-10 mx-20">
                <h2 className="text-xl font-semibold text-gray-700 mb-6">Your Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item bg-white p-6 rounded-lg shadow-xl">
                                <img
                                    src={item.medicine.image_url}
                                    alt={item.medicine.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h3 className="font-semibold text-xl text-gray-800 mb-2">{item.medicine.name}</h3>
                                <p className="text-sm text-gray-600 mb-4">{item.medicine.description}</p>
                                <p className="font-semibold text-green-600 text-lg">฿{item.medicine.price}</p>
                                <div className="quantity flex items-center mt-4 mb-6">
                                    <input
                                        type="number"
                                        value={cartQuantities[item.medicine.id] || item.quantity} // ใช้ item.medicine.id
                                        min="1"
                                        max="10"
                                        onChange={(e) => handleQuantityChange(item.medicine.id, e.target.value)} // ใช้ item.medicine.id
                                        className="border rounded-lg p-3 w-24 text-center text-lg"
                                    />
                                    <button
                                        className="ml-4 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                                        onClick={() => updateCartItem(item.medicine.id)} // ใช้ item.medicine.id
                                    >
                                        Update Quantity
                                    </button>
                                    <button
                                        className="ml-4 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                                        onClick={() => removeFromCart(item.medicine.id)} // ใช้ item.medicine.id
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="mt-20 py-10 text-center text-gray-600">
                <p className="text-sm">
                    © 2025 Medicine Shop | All Rights Reserved | Designed with ♥
                </p>
            </footer>
        </div>
    );
};

export default Cart;
