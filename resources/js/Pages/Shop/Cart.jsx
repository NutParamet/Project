import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/inertia-react';
import Navbar from "@/Components/Navbar";
import NavbarForAuth from "@/Components/NavbarForAuth";
import { router } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

const Cart = ({ cartItems, auth, userId, flash }) => {
    const [cartQuantities, setCartQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // คำนวณ total price
    useEffect(() => {
        const total = cartItems.reduce((acc, item) => {
            const quantity = cartQuantities[item.medicine.id] || item.quantity;
            return acc + item.medicine.price * quantity;
        }, 0);
        setTotalPrice(total);
    }, [cartItems, cartQuantities]);

    // แสดง Flash Message จาก Laravel
    useEffect(() => {
        if (flash?.success) {
            setMessage({ type: 'success', text: flash.success });
        }
        if (flash?.error) {
            setMessage({ type: 'error', text: flash.error });
        }
    }, [flash]);

    // ลบข้อความแจ้งเตือนหลังจาก 3 วินาที
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleQuantityChange = (medicineId, quantity) => {
        const newQuantity = parseInt(quantity, 10);

        if (newQuantity < 1 || newQuantity > 10) {
            setMessage({ type: 'error', text: 'Quantity must be between 1 and 10.' });
            return;
        }

        setCartQuantities(prevQuantities => ({
            ...prevQuantities,
            [medicineId]: newQuantity,
        }));

        const formData = {
            user_id: userId,
            medicine_id: medicineId,
            quantity: newQuantity,
        };

        router.put(`/cart/update/${medicineId}`, formData, {
            onSuccess: () => {
                setMessage({ type: 'success', text: 'Cart updated successfully!' });
            },
            onError: (errors) => {
                setMessage({ type: 'error', text: 'Error updating cart.' });
                console.error("Error updating cart:", errors);
            }
        });
    };

    const removeFromCart = (medicineId) => {
        router.delete(`/cart/delete/${medicineId}`, {
            onSuccess: () => {
                setMessage({ type: 'success', text: 'Item removed from cart!' });
                router.reload(); // รีโหลดหน้าเพื่ออัปเดตข้อมูล
            },
            onError: (errors) => {
                setMessage({ type: 'error', text: 'Error removing item from cart.' });
                console.error("Error removing item from cart:", errors);
            }
        });
    };

    const handleBuy = () => {
        if (cartItems.length === 0) {
            setMessage({ type: 'error', text: 'Your cart is empty.' });
            return;
        }

        setIsLoading(true);

        Inertia.post('/cart/buy', {}, {
            onSuccess: () => {
                setMessage({ type: 'success', text: 'Order placed successfully!' });
                setIsLoading(false);
                router.reload(); // รีโหลดหน้าเพื่ออัปเดตข้อมูล
            },
            onError: (error) => {
                setMessage({ type: 'error', text: error.response.data.message });
                setIsLoading(false);
                console.error('Error placing order:', error.response.data.message);
            }
        });
    };

    return (
        <div className="cart-container bg-gradient-to-b from-blue-50 to-white min-h-screen">
            {auth ? <NavbarForAuth /> : <Navbar />}

            {/* แสดงข้อความแจ้งเตือน */}
            {message.text && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {message.text}
                </div>
            )}

            <div className="cart-items mt-10 mx-4 sm:mx-8 lg:mx-20">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Cart</h2>
                {cartItems.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-600 text-lg mb-4">Your cart is empty.</p>
                        <Link
                            href="/"
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="cart-item bg-white p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                <img
                                    src={item.medicine.image}
                                    alt={item.medicine.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h3 className="font-semibold text-xl text-gray-800 mb-2">{item.medicine.name}</h3>
                                <p className="text-sm text-gray-600 mb-4">{item.medicine.description}</p>
                                <p className="font-semibold text-green-600 text-lg">฿{item.medicine.price}</p>
                                <div className="quantity flex items-center mt-4 mb-6">
                                    <input
                                        type="number"
                                        value={cartQuantities[item.medicine.id] || item.quantity}
                                        min="1"
                                        max="10"
                                        onChange={(e) => handleQuantityChange(item.medicine.id, e.target.value)}
                                        className="border rounded-lg p-3 w-24 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                    <button
                                        className="ml-4 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                                        onClick={() => removeFromCart(item.medicine.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Total Price และ Buy Button */}
                {cartItems.length > 0 && (
                    <div className="total-price mt-8 text-right">
                        <h3 className="text-2xl font-bold text-gray-800">Total Price: ฿{totalPrice.toFixed(2)}</h3>
                        <button
                            className="mt-4 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                            onClick={handleBuy}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Buy Now"}
                        </button>
                    </div>
                )}
            </div>

            <footer className="mt-20 py-10 text-center text-gray-600 bg-white">
                <p className="text-sm">
                    © 2025 Medicine Shop | All Rights Reserved | Designed with ♥
                </p>
            </footer>
        </div>
    );
};

export default Cart;
