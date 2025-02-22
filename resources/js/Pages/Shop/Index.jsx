import React from 'react';
import { router } from '@inertiajs/react';
import Navbar from "@/Components/Navbar";
import NavbarForAuth from "@/Components/NavbarForAuth";

const ShopIndex = ({ medicines, categories, auth, userId, cartItems = [] }) => { // รับ cartItems จาก props
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [cartQuantities, setCartQuantities] = React.useState({});

    const filteredMedicines = medicines.filter(medicine => {
        const matchesCategory = selectedCategory
            ? medicine.category_id === selectedCategory
            : true;
        return matchesCategory;
    });

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleQuantityChange = (medicineId, quantity) => {
        setCartQuantities(prevQuantities => ({
            ...prevQuantities,
            [medicineId]: quantity,
        }));
    };

    const addToCart = (medicineId) => {
        const quantity = cartQuantities[medicineId] || 1;
        const formData = {
            medicine_id: medicineId,
            quantity: quantity,
        };

        // เช็คว่ามีสินค้านี้ในตะกร้าแล้วหรือยัง
        const existingItem = cartItems.find(item => item.medicine_id === medicineId);

        if (existingItem) {
            // ถ้ามีสินค้านี้อยู่แล้ว อัปเดตตะกร้า
            router.put(`/cart/update/${existingItem.id}`, formData, {
                onSuccess: () => {
                    console.log("Cart updated successfully!");
                },
                onError: (errors) => {
                    console.error("Error updating cart:", errors);
                }
            });
        } else {
            // ถ้ายังไม่มีในตะกร้า ให้เพิ่มสินค้าเข้าไป
            router.post(`/cart/add`, formData, {
                onSuccess: () => {
                    console.log("Item added to cart successfully!");
                },
                onError: (errors) => {
                    console.error("Error adding item to cart:", errors);
                }
            });
        }
    };

    return (
        <div className="shop-container bg-gray-50 min-h-screen">
            {auth ? <NavbarForAuth /> : <Navbar />}

            <div className="search-bar mb-10 mt-10 flex justify-center">
                <input
                    type="text"
                    placeholder="Search medicines..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border p-3 rounded-lg w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
            </div>

            <div className="categories mb-10 text-center mx-20">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Browse by Category</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`py-2 px-6 rounded-lg text-lg font-medium
                              ${selectedCategory === category.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-800 hover:bg-blue-600 hover:text-white'}`}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="medicines grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-20">
                {filteredMedicines.map((medicine) => (
                    <div
                        key={medicine.id}
                        className="medicine-card bg-white p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        <img
                            src={medicine.image_url}
                            alt={medicine.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold text-xl text-gray-800 mb-2">{medicine.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{medicine.description}</p>
                        <p className="font-semibold text-green-600 text-lg">฿{medicine.price}</p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addToCart(medicine.id);
                            }}
                        >
                            <div className="quantity flex items-center justify-between mt-4 mb-6">
                                <input
                                    type="number"
                                    value={cartQuantities[medicine.id] || 1}
                                    min="1"
                                    max="10"
                                    onChange={(e) => handleQuantityChange(medicine.id, e.target.value)}
                                    className="border rounded-lg p-3 w-24 text-center text-lg"
                                />
                                <button
                                    type="submit"
                                    className="ml-4 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </form>
                    </div>
                ))}
            </div>

            <footer className="mt-20 py-10 text-center text-gray-600">
                <p className="text-sm">
                    © 2025 Medicine Shop | All Rights Reserved | Designed with ♥
                </p>
            </footer>
        </div>
    );
};

export default ShopIndex;
