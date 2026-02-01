import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../../services/admin.service';
import toast from 'react-hot-toast';

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      loadOrders();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const [orderToPrint, setOrderToPrint] = useState<any>(null);

  const handlePrint = (order: any) => {
    setOrderToPrint(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Print-only CSS */}
      <style>{`
       @media print {
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    height: 100%;
  }

  body * {
    visibility: hidden;
  }

  .print-container {
    visibility: visible !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    padding: 1cm !important;
    margin: 0 !important;
  }

  .print-container * {
    visibility: visible !important;
  }

  .no-print {
    display: none !important;
  }

  @page {
    margin: 0;
    size: A4;
  }
}
      `}</style>

      {/* Hidden Printable Content */}
      <div className="print-container hidden print:block bg-white text-black p-8 font-sans">
        {orderToPrint && (
          <div className="max-w-[800px]">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-black pb-4">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter">Naadan Hub</h1>
                <p className="text-xs font-bold">Inquiry Order Receipt</p>
              </div>
              <div className="text-right">
                <p className="font-black text-sm">Order ID: #{orderToPrint.id.slice(0, 8)}</p>
                <p className="text-[10px] uppercase font-bold">{new Date(orderToPrint.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Shipping Label Box (The part user can cut) */}
            <div className="border-2 border-dashed border-black p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                <p className="text-[10px] font-black uppercase tracking-widest">To: (Shipping Label)</p>
                <p className="text-[8px] font-bold uppercase italic text-gray-500">Cut along the dotted line</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-black uppercase">{orderToPrint.customer_name}</p>
                <p className="text-sm font-bold">Ph: {orderToPrint.customer_phone}</p>
                <div className="pt-2 text-sm leading-snug">
                  <p className="font-black">{orderToPrint.address_line1}</p>
                  {orderToPrint.address_line2 && <p className="font-bold">{orderToPrint.address_line2}</p>}
                  {orderToPrint.landmark && <p className="italic text-xs">Landmark: {orderToPrint.landmark}</p>}
                  <p className="mt-1 font-black underline uppercase">
                    {orderToPrint.city}, {orderToPrint.state} - {orderToPrint.postal_code}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest">{orderToPrint.country}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4">Order Items Summary</p>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="py-2 font-black uppercase tracking-tighter">Product</th>
                    <th className="py-2 text-center font-black uppercase tracking-tighter">Qty</th>
                    <th className="py-2 text-right font-black uppercase tracking-tighter">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orderToPrint.order_items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-3 font-bold uppercase tracking-tighter">{item.product_name}</td>
                      <td className="py-3 text-center font-black">{item.quantity}</td>
                      <td className="py-3 text-right font-bold">₹{item.unit_price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-black">
                    <td colSpan={2} className="py-4 text-right font-black uppercase tracking-widest">Total Amount</td>
                    <td className="py-4 text-right text-lg font-black underline">₹{orderToPrint.total_amount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Footer */}
            <div className="pt-12 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 italic">Thank you for shopping with Naadan Hub</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 no-print">
        <div>
          <h2 className="text-2xl font-black text-gray-900 font-serif">Order Management</h2>
          <p className="text-gray-500 font-medium">Manage WhatsApp and Website orders</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 border-2 border-transparent focus:border-primary px-4 py-2 rounded-xl text-sm font-bold outline-none transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={loadOrders}
            className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:bg-white hover:shadow-md transition-all cursor-pointer"
          >
            <i className="ri-refresh-line text-xl"></i>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Items</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <i className="ri-inbox-line text-5xl text-gray-200 mb-4"></i>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-gray-900 mb-1">
                        #{order.id.slice(0, 8)}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      <div className="mt-2">
                        <span className="bg-green-50 text-green-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border border-green-100">
                          {order.order_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-gray-900 text-sm mb-1">{order.customer_name}</div>
                      <div className="text-xs text-gray-500 font-bold">{order.customer_phone}</div>
                      <div className="text-[10px] text-gray-400 mt-2 max-w-[150px] truncate uppercase tracking-tighter" title={`${order.address_line1}, ${order.city}`}>
                        {order.address_line1}, {order.city}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="text-[11px] text-gray-600 font-bold flex items-center space-x-2">
                            <span className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded font-black">{item.quantity}</span>
                            <span className="truncate max-w-[120px]">{item.product_name}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)} border-current opacity-80`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-lg font-black text-gray-900">₹{order.total_amount}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handlePrint(order)}
                          className="w-9 h-9 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all cursor-pointer shadow-sm"
                          title="Print Shipping Label"
                        >
                          <i className="ri-printer-line"></i>
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="w-9 h-9 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer shadow-sm"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="bg-gray-50 border-2 border-transparent focus:border-primary px-3 py-1.5 rounded-xl text-[10px] font-black outline-none transition-all cursor-pointer uppercase tracking-widest"
                        >
                          <option value="pending">Status</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 no-print">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 font-serif mb-2">Order Details</h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">ID: #{selectedOrder.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                  >
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Customer Info</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Name</p>
                        <p className="text-gray-900 font-black">{selectedOrder.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Phone</p>
                        <p className="text-gray-900 font-black">{selectedOrder.customer_phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Order Info</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(selectedOrder.status)} border border-current`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Date</p>
                        <p className="text-gray-900 font-black">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 ml-2">Shipping Address</h4>
                  <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl shadow-gray-200">
                    <div className="space-y-2">
                      <p className="text-lg font-black">{selectedOrder.address_line1}</p>
                      {selectedOrder.address_line2 && <p className="text-sm opacity-80">{selectedOrder.address_line2}</p>}
                      {selectedOrder.landmark && <p className="text-xs opacity-60 italic">Landmark: {selectedOrder.landmark}</p>}
                      <div className="pt-4 border-t border-white/10 mt-4">
                        <p className="font-bold">{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postal_code}</p>
                        <p className="text-xs uppercase tracking-widest opacity-60 mt-1">{selectedOrder.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 ml-2">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary font-black shadow-sm border border-gray-100">{item.quantity}</div>
                          <div>
                            <p className="font-black text-gray-900 text-sm">{item.product_name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">₹{item.unit_price} per unit</p>
                          </div>
                        </div>
                        <p className="font-black text-gray-900">₹{item.quantity * item.unit_price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handlePrint(selectedOrder)}
                      className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all cursor-pointer flex items-center space-x-2"
                    >
                      <i className="ri-printer-line"></i>
                      <span>Print Label</span>
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</span>
                    <span className="text-4xl font-black text-primary">₹{selectedOrder.total_amount}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
