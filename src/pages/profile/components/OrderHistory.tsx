
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  order_type: string;
  customer_name: string;
  customer_phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  landmark?: string;
  order_items?: any[];
}

interface OrderHistoryProps {
  userId: string;
}

export default function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadOrders();
    }
  }, [userId]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: 'ri-time-line',
      processing: 'ri-loader-4-line',
      shipped: 'ri-truck-line',
      delivered: 'ri-checkbox-circle-line',
      cancelled: 'ri-close-circle-line',
    };
    return icons[status] || 'ri-information-line';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-12">
          <i className="ri-error-warning-line text-6xl text-red-300 mb-4"></i>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadOrders}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-refresh-line"></i>
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 mb-4">No orders yet</p>
          <a
            href="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-shopping-cart-line"></i>
            <span>Start Shopping</span>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-xl p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                  <i className={getStatusIcon(order.status)}></i>
                  <span className="uppercase">{order.status}</span>
                </span>
              </div>

              {order.order_items && order.order_items.length > 0 && (
                <div className="space-y-3 mb-4">
                  {order.order_items.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex items-center space-x-4">
                      {/* Using a placeholder for items if they don't have images in the items table */}
                      <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-primary font-black border">
                        {item.quantity}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product_name || item.name}</h4>
                        <p className="text-sm text-gray-600">Unit Price: ₹{item.unit_price || item.price}</p>
                      </div>
                      <p className="font-semibold text-gray-900">₹{((item.unit_price || item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-xl font-bold text-gray-900">₹{order.total_amount.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center space-x-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-eye-line"></i>
                  <span>View Details</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                Order Details
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <i className="ri-close-line text-2xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Order Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order ID</p>
                    <p className="font-medium">#{selectedOrder.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-medium text-lg">₹{selectedOrder.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Details</h4>
                  <div className="p-4 bg-gray-50 rounded-lg text-sm">
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                    <p className="text-gray-600">{selectedOrder.customer_phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                  <div className="p-4 bg-gray-50 rounded-lg text-sm">
                    <p className="text-gray-900">
                      {selectedOrder.address_line1}
                      {selectedOrder.address_line2 && `, ${selectedOrder.address_line2}`}
                      {selectedOrder.landmark && <br />}
                      {selectedOrder.landmark && `Landmark: ${selectedOrder.landmark}`}
                      <br />
                      {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postal_code}
                      <br />
                      {selectedOrder.country}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary font-black border">
                        {item.quantity}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{item.product_name}</h5>
                        <p className="text-sm text-gray-600">₹{item.unit_price} each</p>
                      </div>
                      <p className="font-semibold text-gray-900">₹{(item.unit_price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
