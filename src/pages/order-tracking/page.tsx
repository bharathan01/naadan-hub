import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';
import { orderService, Order } from '../../services/order.service';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface OrderStatus {
  status: string;
  timestamp: string;
  location: string;
  description: string;
}

interface OrderDetails {
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  currentStatus: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  trackingHistory: OrderStatus[];
}

// Mock data for demonstration
const mockOrder: OrderDetails = {
  orderId: "ORD-2024-001234",
  orderDate: "2024-01-15 10:30 AM",
  estimatedDelivery: "2024-01-18",
  currentStatus: "shipped",
  customerName: "Priya Sharma",
  customerPhone: "+9197461 55376",
  deliveryAddress: "123, MG Road, Kochi, Kerala - 682001",
  items: [
    {
      id: 1,
      name: "Organic Rice",
      quantity: 2,
      price: 80,
      image: "https://readdy.ai/api/search-image?query=premium%20organic%20rice%20grains%20in%20burlap%20sack%2C%20natural%20lighting%2C%20rustic%20wooden%20background%2C%20high%20quality%20food%20photography%2C%20detailed%20texture&width=200&height=200&seq=rice2&orientation=squarish"
    },
    {
      id: 2,
      name: "Fresh Vegetables Mix",
      quantity: 1,
      price: 120,
      image: "https://readdy.ai/api/search-image?query=fresh%20organic%20vegetables%20basket%2C%20colorful%20mix%20of%20tomatoes%20carrots%20beans%2C%20natural%20lighting%2C%20farm%20fresh%20produce%20photography&width=200&height=200&seq=veg2&orientation=squarish"
    }
  ],
  subtotal: 280,
  deliveryFee: 50,
  total: 330,
  paymentMethod: "Cash on Delivery",
  trackingHistory: [
    {
      status: "Order Placed",
      timestamp: "2024-01-15 10:30 AM",
      location: "Kochi",
      description: "Your order has been successfully placed and confirmed."
    },
    {
      status: "Order Confirmed",
      timestamp: "2024-01-15 11:45 AM",
      location: "Green Valley Farm, Kottayam",
      description: "Seller has confirmed your order and started preparing items."
    },
    {
      status: "Packed & Ready",
      timestamp: "2024-01-16 09:15 AM",
      location: "Green Valley Farm, Kottayam",
      description: "Your order has been carefully packed and is ready for shipment."
    },
    {
      status: "Shipped",
      timestamp: "2024-01-16 02:30 PM",
      location: "Kottayam Distribution Center",
      description: "Your order is on the way to your delivery address."
    }
  ]
};

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: 'ri-shopping-cart-line' },
  { key: 'processing', label: 'Processing', icon: 'ri-time-line' },
  { key: 'shipped', label: 'Shipped', icon: 'ri-truck-line' },
  { key: 'delivered', label: 'Delivered', icon: 'ri-home-smile-line' }
];

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const orderIdFromUrl = searchParams.get('orderId');

  const [orderIdInput, setOrderIdInput] = useState(orderIdFromUrl || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState('');

  const mapOrderData = (data: any): OrderDetails => {
    const subtotal = data.order_items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0);
    // Estimated delivery 3 days after created_at
    const createdDate = new Date(data.created_at);
    const estimatedDate = new Date(createdDate);
    estimatedDate.setDate(createdDate.getDate() + 3);

    return {
      orderId: data.id,
      orderDate: createdDate.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      estimatedDelivery: estimatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      currentStatus: data.status,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      deliveryAddress: `${data.address_line1}${data.address_line2 ? ', ' + data.address_line2 : ''}, ${data.city}, ${data.state} - ${data.postal_code}`,
      items: data.order_items.map((item: any) => ({
        id: item.id,
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price,
        image: item.products?.images?.[0] || 'https://via.placeholder.com/200?text=Product'
      })),
      subtotal,
      deliveryFee: data.total_amount - subtotal,
      total: data.total_amount,
      paymentMethod: data.order_type === 'whatsapp' ? 'WhatsApp Order (COD/Direct)' : 'Online Payment',
      trackingHistory: [
        {
          status: 'Order Placed',
          timestamp: createdDate.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          location: data.city,
          description: 'Your order has been successfully placed.'
        },
        ...(data.status !== 'pending' ? [{
          status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
          timestamp: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          location: 'Processing Center',
          description: `Order is currently ${data.status}.`
        }] : [])
      ]
    };
  };

  useEffect(() => {
    if (user) {
      const fetchUserOrders = async () => {
        try {
          setLoadingOrders(true);
          const orders = await orderService.getMyOrders();
          setUserOrders(orders);
        } catch (err) {
          console.error('Error fetching user orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchUserOrders();
    }
  }, [user]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderIdFromUrl) {
        setLoading(true);
        try {
          // If we have search params but not the phone, we might not be able to fetch if not logged in
          // However, if the user is logged in, we can try to find it in their orders
          let foundOrder = null;
          if (user) {
            const orders = await orderService.getMyOrders();
            foundOrder = orders.find((o: any) => o.id === orderIdFromUrl);
          }

          if (foundOrder) {
            setOrder(mapOrderData(foundOrder));
          } else {
            // Need phone for guest tracking, but here we just show error if not found in user orders
            setError('Could not find order. Please use the form to track with Phone Number.');
          }
        } catch (err) {
          setError('Failed to load order details.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrderDetails();
  }, [orderIdFromUrl, user]);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!orderIdInput.trim()) {
      setError('Please enter your Order ID');
      return;
    }

    if (!phoneInput.trim()) {
      setError('Please enter your Phone Number');
      return;
    }

    setLoading(true);
    try {
      const data = await orderService.getOrderByIdAndPhone(orderIdInput, phoneInput);
      if (data) {
        setOrder(mapOrderData(data));
        navigate(`/order-tracking?orderId=${orderIdInput}`);
      } else {
        setError('Order not found. Please check your credentials.');
      }
    } catch (err) {
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    const statusMap: { [key: string]: number } = {
      'pending': 0,
      'processing': 1,
      'shipped': 2,
      'delivered': 3,
      'cancelled': -1
    };
    return statusMap[order?.currentStatus || 'pending'] || 0;
  };

  const getStatusColor = (index: number) => {
    const currentIndex = getCurrentStepIndex();
    if (index < currentIndex) return 'bg-green-500';
    if (index === currentIndex) return 'bg-primary';
    return 'bg-gray-300';
  };

  const getStatusTextColor = (index: number) => {
    const currentIndex = getCurrentStepIndex();
    if (index <= currentIndex) return 'text-gray-900';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="solid" />

      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 font-serif">
              Track Your Order
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your order details to track your delivery in real-time
            </p>
          </motion.div>

          {!order ? (
            /* Tracking Form */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-map-pin-line text-3xl text-primary"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Package</h2>
                  <p className="text-sm text-gray-600">Enter your order details below</p>
                </div>

                <form onSubmit={handleTrackOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Order ID
                    </label>
                    <input
                      type="text"
                      value={orderIdInput}
                      onChange={(e) => setOrderIdInput(e.target.value)}
                      placeholder="e.g., ORD-2024-001234"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+9197461 55376"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      <i className="ri-error-warning-line mr-2"></i>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="ri-loader-4-line animate-spin"></i>
                        Tracking...
                      </span>
                    ) : (
                      'Track Order'
                    )}
                  </button>
                </form>

              </div>

              {/* User Recent Orders List */}
              {user && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <i className="ri-history-line text-primary"></i>
                    Your Recent Orders
                  </h3>
                  {loadingOrders ? (
                    <div className="flex justify-center py-8">
                      <i className="ri-loader-4-line text-3xl text-primary animate-spin"></i>
                    </div>
                  ) : userOrders.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {userOrders.slice(0, 4).map((orderItem) => (
                        <div
                          key={orderItem.id}
                          onClick={() => {
                            setOrder(mapOrderData(orderItem));
                            setOrderIdInput(orderItem.id);
                            navigate(`/order-tracking?orderId=${orderItem.id}`);
                          }}
                          className="bg-white border-2 border-gray-100 rounded-2xl p-4 hover:border-primary transition-all cursor-pointer group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-400 group-hover:text-primary transition-colors">
                              #{orderItem.id.slice(0, 8)}...
                            </span>
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${orderItem.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              orderItem.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                              {orderItem.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <i className="ri-shopping-bag-line text-gray-600"></i>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">₹{orderItem.total_amount}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(orderItem.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
                      <p className="text-gray-500">You haven't placed any orders yet.</p>
                      <button
                        onClick={() => navigate('/products')}
                        className="mt-3 text-primary font-bold text-sm hover:underline cursor-pointer"
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            /* Order Tracking Details */
            <div className="space-y-6 md:space-y-8">
              {/* Order Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-3xl p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Order #{order.orderId}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600">
                      Placed on {order.orderDate}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setOrder(null);
                        setOrderIdInput('');
                        setPhoneInput('');
                        navigate('/order-tracking');
                      }}
                      className="bg-white text-gray-700 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Track Another Order
                    </button>
                    <button
                      onClick={() => navigate('/profile')}
                      className="bg-primary text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      View All Orders
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Progress Tracker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8"
              >
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">Order Status</h3>

                {/* Desktop Progress Bar */}
                <div className="hidden md:block">
                  <div className="flex items-center justify-between mb-4">
                    {statusSteps.map((step, index) => (
                      <div key={step.key} className="flex-1 flex items-center">
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getStatusColor(index)} transition-colors`}>
                            <i className={`${step.icon} text-2xl text-white`}></i>
                          </div>
                          <p className={`mt-3 text-sm font-semibold ${getStatusTextColor(index)}`}>
                            {step.label}
                          </p>
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`flex-1 h-1 mx-2 ${index < getCurrentStepIndex() ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Progress Bar */}
                <div className="md:hidden space-y-4">
                  {statusSteps.map((step, index) => (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(index)} transition-colors flex-shrink-0`}>
                          <i className={`${step.icon} text-xl text-white`}></i>
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`w-1 h-12 my-1 ${index < getCurrentStepIndex() ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className={`text-base font-semibold ${getStatusTextColor(index)}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Estimated Delivery */}
                <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <i className="ri-calendar-check-line text-2xl md:text-3xl text-green-600"></i>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Estimated Delivery</p>
                      <p className="text-base md:text-lg font-bold text-gray-900">{order.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {/* Tracking History */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="md:col-span-2 bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Tracking History</h3>
                  <div className="space-y-6">
                    {order.trackingHistory.map((status, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${index === 0 ? 'bg-primary' : 'bg-green-500'
                            }`}>
                            <i className="ri-checkbox-circle-fill text-xl text-white"></i>
                          </div>
                          {index < order.trackingHistory.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 my-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h4 className="text-base md:text-lg font-bold text-gray-900">{status.status}</h4>
                            <span className="text-xs md:text-sm text-gray-600">{status.timestamp}</span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 mb-1">
                            <i className="ri-map-pin-line mr-1"></i>
                            {status.location}
                          </p>
                          <p className="text-xs md:text-sm text-gray-700">{status.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Delivery Address */}
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                    <h4 className="text-base md:text-lg font-bold text-gray-900 mb-4">Delivery Address</h4>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                      <p className="text-sm text-gray-600">{order.customerPhone}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                    <h4 className="text-base md:text-lg font-bold text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-sm font-bold text-primary">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-cream rounded-2xl p-6">
                    <h4 className="text-base md:text-lg font-bold text-gray-900 mb-4">Payment Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold text-gray-900">₹{order.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-semibold text-gray-900">₹{order.deliveryFee}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-3 flex justify-between">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-primary text-lg">₹{order.total}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-300">
                        <p className="text-xs text-gray-600">Payment Method</p>
                        <p className="text-sm font-semibold text-gray-900">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="bg-primary/10 rounded-2xl p-6">
                    <h4 className="text-base font-bold text-gray-900 mb-3">Need Help?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Contact our support team for any queries about your order.
                    </p>
                    <button
                      onClick={() => navigate('/contact')}
                      className="w-full bg-primary text-white py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Contact Support
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}