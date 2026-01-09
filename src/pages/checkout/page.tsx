import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Kerala',
    pincode: '',
    deliveryMethod: 'standard',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      navigate('/cart');
    }
    setCartItems(cart);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Place order
      alert('Order placed successfully! Thank you for shopping with Naadan Hub.');
      localStorage.removeItem('cart');
      navigate('/');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = formData.deliveryMethod === 'express' ? 100 : subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 font-serif">
              Checkout
            </h1>
          </motion.div>

          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="font-semibold hidden sm:inline">Shipping</span>
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="font-semibold hidden sm:inline">Payment</span>
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="font-semibold hidden sm:inline">Review</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-8">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-900 mb-4">
                        Delivery Method *
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="standard"
                            checked={formData.deliveryMethod === 'standard'}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary cursor-pointer"
                          />
                          <div className="ml-4 flex-1">
                            <div className="font-semibold text-gray-900">Standard Delivery</div>
                            <div className="text-sm text-gray-500">3-5 business days • Free on orders above ₹500</div>
                          </div>
                          <div className="font-bold text-primary">₹{subtotal > 500 ? 0 : 50}</div>
                        </label>
                        <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="express"
                            checked={formData.deliveryMethod === 'express'}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary cursor-pointer"
                          />
                          <div className="ml-4 flex-1">
                            <div className="font-semibold text-gray-900">Express Delivery</div>
                            <div className="text-sm text-gray-500">1-2 business days</div>
                          </div>
                          <div className="font-bold text-primary">₹100</div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                    
                    <div className="space-y-3 mb-6">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleChange}
                          className="w-5 h-5 text-primary cursor-pointer"
                        />
                        <div className="ml-4 flex-1">
                          <div className="font-semibold text-gray-900">Cash on Delivery</div>
                          <div className="text-sm text-gray-500">Pay when you receive your order</div>
                        </div>
                        <i className="ri-money-rupee-circle-line text-3xl text-primary"></i>
                      </label>
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={formData.paymentMethod === 'upi'}
                          onChange={handleChange}
                          className="w-5 h-5 text-primary cursor-pointer"
                        />
                        <div className="ml-4 flex-1">
                          <div className="font-semibold text-gray-900">UPI Payment</div>
                          <div className="text-sm text-gray-500">Pay using Google Pay, PhonePe, Paytm</div>
                        </div>
                        <i className="ri-smartphone-line text-3xl text-primary"></i>
                      </label>
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleChange}
                          className="w-5 h-5 text-primary cursor-pointer"
                        />
                        <div className="ml-4 flex-1">
                          <div className="font-semibold text-gray-900">Credit/Debit Card</div>
                          <div className="text-sm text-gray-500">Visa, Mastercard, Rupay</div>
                        </div>
                        <i className="ri-bank-card-line text-3xl text-primary"></i>
                      </label>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h2>
                    
                    <div className="bg-cream rounded-2xl p-6 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                      <p className="text-gray-600">
                        {formData.fullName}<br />
                        {formData.address}<br />
                        {formData.city}, {formData.state} - {formData.pincode}<br />
                        Phone: {formData.phone}<br />
                        Email: {formData.email}
                      </p>
                    </div>

                    <div className="bg-cream rounded-2xl p-6 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Delivery Method</h3>
                      <p className="text-gray-600 capitalize">{formData.deliveryMethod} Delivery</p>
                    </div>

                    <div className="bg-cream rounded-2xl p-6 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                      <p className="text-gray-600 capitalize">
                        {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                         formData.paymentMethod === 'upi' ? 'UPI Payment' : 'Credit/Debit Card'}
                      </p>
                    </div>

                    <div className="bg-cream rounded-2xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white">
                                <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between mt-8">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="ml-auto px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {step === 3 ? 'Place Order' : 'Continue'}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-cream rounded-2xl p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-primary">₹{total}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-300">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <i className="ri-shield-check-line text-xl text-primary"></i>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <i className="ri-truck-line text-xl text-primary"></i>
                    <span>Fast delivery</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <i className="ri-arrow-go-back-line text-xl text-primary"></i>
                    <span>Easy returns within 7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}