
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface PaymentMethod {
  id: string;
  payment_type: string;
  card_holder_name?: string;
  card_last_four?: string;
  card_expiry?: string;
  upi_id?: string;
  is_default: boolean;
}

interface PaymentMethodsProps {
  userId: string;
}

export default function PaymentMethods({ userId }: PaymentMethodsProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    payment_type: 'card',
    card_holder_name: '',
    card_number: '',
    card_expiry: '',
    card_cvv: '',
    upi_id: '',
    is_default: false,
  });

  useEffect(() => {
    if (userId) {
      loadPaymentMethods();
    }
  }, [userId]);

  const loadPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) throw error;
      if (data) setMethods(data);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (formData.payment_type === 'card') {
        if (!formData.card_holder_name || !formData.card_number || !formData.card_expiry) {
          throw new Error('Please fill all card details');
        }
      } else if (formData.payment_type === 'upi') {
        if (!formData.upi_id) {
          throw new Error('Please enter UPI ID');
        }
      }

      const dataToSave: any = {
        user_id: userId,
        payment_type: formData.payment_type,
        is_default: formData.is_default,
      };

      if (formData.payment_type === 'card') {
        dataToSave.card_holder_name = formData.card_holder_name;
        dataToSave.card_last_four = formData.card_number.slice(-4);
        dataToSave.card_expiry = formData.card_expiry;
      } else if (formData.payment_type === 'upi') {
        dataToSave.upi_id = formData.upi_id;
      }

      const { error } = await supabase.from('payment_methods').insert(dataToSave);
      if (error) throw error;
      
      resetForm();
      loadPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      // You could add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }
    
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      loadPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    try {
      // First, unset all defaults for this user
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
      
      // Then set the new default
      const { error: setError } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);
      
      if (setError) throw setError;
      
      loadPaymentMethods();
    } catch (error) {
      console.error('Error setting default payment method:', error);
    } finally {
      setSettingDefaultId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      payment_type: 'card',
      card_holder_name: '',
      card_number: '',
      card_expiry: '',
      card_cvv: '',
      upi_id: '',
      is_default: false,
    });
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            <span>Add Payment Method</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-6 p-6 border border-gray-200 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Add New Payment Method</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setFormData({ ...formData, payment_type: 'card' })}
                className={`flex-1 py-3 px-4 border-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  formData.payment_type === 'card'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <i className="ri-bank-card-line text-xl mr-2"></i>
                Credit/Debit Card
              </button>
              <button
                onClick={() => setFormData({ ...formData, payment_type: 'upi' })}
                className={`flex-1 py-3 px-4 border-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  formData.payment_type === 'upi'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <i className="ri-smartphone-line text-xl mr-2"></i>
                UPI
              </button>
            </div>
          </div>

          {formData.payment_type === 'card' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  value={formData.card_holder_name}
                  onChange={(e) => setFormData({ ...formData, card_holder_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={formData.card_number}
                  onChange={(e) => setFormData({ ...formData, card_number: e.target.value.replace(/\s/g, '') })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={formData.card_expiry}
                    onChange={(e) => setFormData({ ...formData, card_expiry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={formData.card_cvv}
                    onChange={(e) => setFormData({ ...formData, card_cvv: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                value={formData.upi_id}
                onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="yourname@upi"
              />
            </div>
          )}

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
            />
            <label className="ml-2 text-sm text-gray-700">
              Set as default payment method
            </label>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={resetForm}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {loading ? 'Saving...' : 'Save Payment Method'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className="p-6 border border-gray-200 rounded-xl hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className={`${method.payment_type === 'card' ? 'ri-bank-card-line' : 'ri-smartphone-line'} text-2xl text-primary`}></i>
                </div>
                <div>
                  {method.payment_type === 'card' ? (
                    <>
                      <h4 className="font-semibold text-gray-900">
                        •••• •••• •••• {method.card_last_four}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {method.card_holder_name} • Expires {method.card_expiry}
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className="font-semibold text-gray-900">UPI</h4>
                      <p className="text-sm text-gray-600">{method.upi_id}</p>
                    </>
                  )}
                  {method.is_default && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      Default
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {!method.is_default && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    disabled={settingDefaultId === method.id}
                    className="p-2 text-gray-600 hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                    title="Set as default"
                  >
                    <i className="ri-checkbox-circle-line text-xl"></i>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(method.id)}
                  disabled={deletingId === method.id}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete"
                >
                  <i className="ri-delete-bin-line text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        ))}

        {methods.length === 0 && !isAdding && (
          <div className="text-center py-12">
            <i className="ri-bank-card-line text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No payment methods added yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
