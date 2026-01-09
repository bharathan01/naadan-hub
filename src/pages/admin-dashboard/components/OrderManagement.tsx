
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
  shipping_address: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      customer: {
        name: 'Rajesh Kumar',
        email: 'rajesh@email.com',
        phone: '+91 98765 43210'
      },
      items: [
        { name: 'Organic Rice', quantity: 2, price: 160 },
        { name: 'Turmeric Powder', quantity: 1, price: 150 }
      ],
      total: 310,
      status: 'pending',
      payment_status: 'pending',
      created_at: '2024-01-16',
      shipping_address: 'House No. 123, MG Road, Kottayam, Kerala - 686001'
    },
    {
      id: 'ORD002',
      customer: {
        name: 'Priya Nair',
        email: 'priya@email.com',
        phone: '+91 87654 32109'
      },
      items: [
        { name: 'Fresh Vegetables Mix', quantity: 3, price: 360 },
        { name: 'Coconut Oil', quantity: 1, price: 200 }
      ],
      total: 560,
      status: 'confirmed',
      payment_status: 'paid',
      created_at: '2024-01-15',
      shipping_address: 'Flat 2B, Green Apartments, Thrissur, Kerala - 680001'
    },
    {
      id: 'ORD003',
      customer: {
        name: 'Arun Menon',
        email: 'arun@email.com',
        phone: '+91 76543 21098'
      },
      items: [
        { name: 'Organic Rice', quantity: 5, price: 400 }
      ],
      total: 400,
      status: 'shipped',
      payment_status: 'paid',
      created_at: '2024-01-14',
      shipping_address: 'Villa 45, Palm Grove Colony, Ernakulam, Kerala - 682001'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const paymentStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm"
    >
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
            <p className="text-gray-600 mt-1">Track and manage all orders</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-700 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-800">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">Confirmed</p>
            <p className="text-2xl font-bold text-blue-800">
              {orders.filter(o => o.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-700 font-medium">Shipped</p>
            <p className="text-2xl font-bold text-purple-800">
              {orders.filter(o => o.status === 'shipped').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700 font-medium">Delivered</p>
            <p className="text-2xl font-bold text-green-800">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">
              ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    Order #{order.id}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.payment_status]}`}>
                      {order.payment_status === 'paid' ? 'Paid' : order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </h3>
                  <p className="text-gray-600 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{order.total}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <i className="ri-user-line"></i>
                      {order.customer.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="ri-mail-line"></i>
                      {order.customer.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="ri-phone-line"></i>
                      {order.customer.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-600 flex items-start gap-2">
                    <i className="ri-map-pin-line mt-0.5"></i>
                    {order.shipping_address}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{item.name}</span>
                      <span className="text-gray-600">Qty: {item.quantity} × ₹{item.price / item.quantity} = ₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'confirmed')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <i className="ri-check-line"></i>
                    Confirm Order
                  </button>
                )}
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'shipped')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <i className="ri-truck-line"></i>
                    Mark as Shipped
                  </button>
                )}
                {order.status === 'shipped' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <i className="ri-checkbox-circle-line"></i>
                    Mark as Delivered
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-primary hover:bg-primary/10 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                >
                  <i className="ri-eye-line"></i>
                  View Details
                </button>

                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <i className="ri-close-line"></i>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Order Details - #{selectedOrder.id}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer & Order Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.customer.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Order Date:</span> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${statusColors[selectedOrder.status]}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </p>
                    <p><span className="font-medium">Payment:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${paymentStatusColors[selectedOrder.payment_status]}`}>
                        {selectedOrder.payment_status.charAt(0).toUpperCase() + selectedOrder.payment_status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedOrder.shipping_address}</p>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{item.price}</p>
                        <p className="text-sm text-gray-600">₹{item.price / item.quantity} each</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                    <span className="text-xl font-bold text-primary">₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
