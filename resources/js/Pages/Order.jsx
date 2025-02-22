import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';

export default function Order({ orders }) {
    const { delete: destroy } = useForm();
    const { flash } = usePage().props;

    // State สำหรับจัดการ Flash Message
    const [showFlash, setShowFlash] = useState(false);
    const [flashMessage, setFlashMessage] = useState({ type: '', message: '' });

    // แสดง Flash Message เมื่อมีข้อความใหม่
    useEffect(() => {
        if (flash.success || flash.error) {
            setFlashMessage({
                type: flash.success ? 'success' : 'error',
                message: flash.success || flash.error,
            });
            setShowFlash(true);

            // ซ่อน Flash Message อัตโนมัติหลังจาก 5 วินาที
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 5000);

            // Clear timer เมื่อ component unmount
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this order?')) {
            destroy(route('order.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Orders
                </h2>
            }
        >
            <Head title="Orders" />

            {/* Flash Message */}
            {showFlash && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${flashMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {flashMessage.message}
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-blue-900">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h3>
                            {orders.length > 0 ? (
                                <div className="space-y-6">
                                    {orders.map(order => (
                                        <div key={order.id} className="border p-6 rounded-lg shadow-md">
                                            <div className="flex justify-between items-center mb-4">
                                                <p className="text-lg font-semibold text-gray-800">Order ID: {order.id}</p>
                                                <p className={`text-sm font-semibold ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    Status: {order.status}
                                                </p>
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                Total Price: ${Number(order.total_price || 0).toFixed(2)}
                                            </p>
                                            <ul className="space-y-4">
                                                {order.order_details.map(detail => (
                                                    <li key={detail.id} className="border-b pb-4">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-gray-800 font-medium">{detail.medicine.name}</p>
                                                                <p className="text-sm text-gray-600">{detail.medicine.description}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-gray-800">Quantity: {detail.quantity}</p>
                                                                <p className="text-gray-800">Price: ${Number(detail.price || 0).toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                                            >
                                                Delete Order
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-600 text-lg mb-4">You Don't Have Order.</p>
                                    <a
                                        href="/"
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                                    >
                                        Continue Shopping
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
