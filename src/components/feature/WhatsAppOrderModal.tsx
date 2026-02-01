import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services/product.service';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Product {
    id: string;
    name: string;
    price: number;
}

interface WhatsAppOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
    quantity?: number;
}

export default function WhatsAppOrderModal({ isOpen, onClose, product, quantity = 1 }: WhatsAppOrderModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        landmark: '',
    });

    useEffect(() => {
        // Pre-fill if user is logged in
        async function getProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (profile) {
                    setFormData(prev => ({
                        ...prev,
                        customer_name: profile.full_name || '',
                        customer_phone: profile.phone || '',
                    }));
                }
            }
        }
        if (isOpen) getProfile();
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const total_amount = product.price * quantity;

            const orderData = {
                user_id: user?.id || null,
                customer_name: formData.customer_name,
                customer_phone: formData.customer_phone,
                address_line1: formData.address_line1,
                address_line2: formData.address_line2,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postal_code,
                country: formData.country,
                landmark: formData.landmark,
                total_amount: total_amount,
                status: 'pending',
                order_type: 'whatsapp'
            };

            const items = [{
                product_id: product.id,
                product_name: product.name,
                quantity: quantity,
                unit_price: product.price
            }];

            const order = await productService.createOrder(orderData, items);

            // Generate WhatsApp Link
            const message = [
                `*New Order from Naadan Hub*`,
                ``,
                `*Order ID: #${order.id.slice(0, 8)}*`,
                ``,
                `*Customer Details:*`,
                `Name: ${formData.customer_name}`,
                `Phone: ${formData.customer_phone}`,
                ``,
                `*Shipping Address:*`,
                formData.address_line1,
                formData.address_line2,
                formData.landmark ? `Landmark: ${formData.landmark}` : null,
                `${formData.city}, ${formData.state}`,
                formData.postal_code,
                formData.country,
                ``,
                `*Order Items:*`,
                `${product.name} x ${quantity} - ₹${total_amount}`,
                ``,
                `*Total: ₹${total_amount}*`
            ].filter(line => line !== null && line !== '').join('\n');

            const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;

            toast.success('Order placed and saving details!');
            window.open(whatsappUrl, '_blank');
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to process order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        <div className="p-8 md:p-10 overflow-y-auto">
                            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 pb-4 border-b border-gray-50">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 font-serif">Order Details</h2>
                                    <p className="text-gray-500 font-medium">Provide shipping info for WhatsApp order</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                    <i className="ri-close-line text-2xl"></i>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.customer_name}
                                            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all outline-none font-medium"
                                            placeholder="Full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.customer_phone}
                                            onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all outline-none font-medium"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Address Line 1</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.address_line1}
                                            onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all outline-none font-medium"
                                            placeholder="House / Building / Street"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Address Line 2 (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.address_line2}
                                            onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all outline-none font-medium"
                                            placeholder="Apartment / Landmark"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">City</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all outline-none font-medium"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">State</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all outline-none font-medium"
                                                placeholder="State"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Pincode</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.postal_code}
                                                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all outline-none font-medium"
                                                placeholder="6-digit Pincode"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Country</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all outline-none font-medium"
                                                placeholder="Country"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Landmark (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.landmark}
                                            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all outline-none font-medium"
                                            placeholder="Nearby landmark"
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-2xl font-black text-gray-800">₹{product?.price ? product.price * quantity : 0}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">{product?.name}</p>
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-[#25D366] text-white py-5 rounded-[1.5rem] font-bold hover:bg-[#128C7E] transition-all flex items-center justify-center space-x-3 cursor-pointer shadow-xl shadow-green-100 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <i className="ri-whatsapp-line text-2xl"></i>
                                            <span>Confirm & Open WhatsApp</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
