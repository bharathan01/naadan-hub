import { supabase } from '../lib/supabase';

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    items?: any[];
}

export const orderService = {
    async createOrder(order: Omit<Order, 'id' | 'created_at' | 'status'>) {
        const { data, error } = await supabase
            .from('orders')
            .insert([{ ...order, status: 'pending' }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getMyOrders() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, products(*))')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async updateOrderStatus(orderId: string, status: Order['status']) {
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
