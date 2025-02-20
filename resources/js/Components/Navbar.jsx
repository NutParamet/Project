import React, { useState } from 'react';

const Navbar = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-xl font-bold">
                    <a href="/" className="hover:text-gray-200">Medicine Shop</a>
                </div>
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
                <div className={`lg:flex items-center space-x-6 ${isNavOpen ? 'block' : 'hidden'}`}>
                    <a href="/" className="text-white hover:text-gray-200">Home</a>
                    <a href={route('login')} className="text-white hover:text-gray-200">Login</a>
                    <a href={route('register')} className="text-white hover:text-gray-200">Register</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
