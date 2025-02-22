import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const NavbarForAuth = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleLogout = () => {
        Inertia.post(route('logout')); // Send a POST request for logout
    };

    return (
        <nav className="bg-blue-600 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo and title */}
                <div className="text-white text-xl font-bold">
                    <a href="/" className="hover:text-gray-200">Medicine Shop</a>
                </div>
                {/* Mobile Menu Toggle */}
                <div className="lg:hidden">
                    <button onClick={() => setIsNavOpen(!isNavOpen)} className="text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
                {/* Menu items */}
                <div className={`lg:flex items-center space-x-6 ${isNavOpen ? 'block' : 'hidden'}`}>
                    <button onClick={() => Inertia.visit('/')} className="text-white hover:text-gray-200">Home</button>
                    <button onClick={() => Inertia.visit(route('order'))} className="text-white hover:text-gray-200">Profile</button>
                    <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
                    {/* Cart Button */}
                    <button
                        onClick={() => Inertia.visit('/cart')}
                        className="flex items-center hover:text-gray-200 text-white rounded-lg px-4 py-2 ml-4 transition-all duration-300 ease-in-out transform hover:scale-105 border-2 border-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <span className="ml-2">Cart</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavbarForAuth;
