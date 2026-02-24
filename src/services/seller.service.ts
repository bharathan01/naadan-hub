import { supabase } from '../lib/supabase';
import { Product } from './product.service';

export const sellerService = {
    async getSellerStats(sellerId: string) {
        // 1. Total Products
        const { count: productsCount, error: prodError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('seller_id', sellerId);

        // 2. Total Orders (orders containing seller's products)
        // We join order_items to find orders that have at least one product from this seller
        const { data: sellerOrderItems, error: orderError } = await supabase
            .from('order_items')
            .select('order_id, quantity, unit_price, products!inner(seller_id)')
            .eq('products.seller_id', sellerId);

        if (prodError || orderError) throw (prodError || orderError);

        const uniqueOrderIds = new Set(sellerOrderItems?.map(item => item.order_id));
        const totalSales = sellerOrderItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        const totalRevenue = sellerOrderItems?.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0) || 0;

        return {
            totalProducts: productsCount || 0,
            totalOrders: uniqueOrderIds.size,
            totalSales,
            totalRevenue,
            pendingOrders: 0 // Will need to fetch order statuses to calculate this
        };
    },

    async getSellerProducts(sellerId: string) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('seller_id', sellerId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Product[];
    },

    async getSellerOrders(sellerId: string) {
        // Fetch orders that contain items from this seller
        const { data, error } = await supabase
            .from('order_items')
            .select(`
                *,
                orders!inner(*),
                products!inner(seller_id)
            `)
            .eq('products.seller_id', sellerId)
            .order('created_at', { foreignTable: 'orders', ascending: false });

        if (error) throw error;

        // Group by order_id so the UI shows one entry per order
        const groupedOrders: Record<string, any> = {};
        data?.forEach((item: any) => {
            if (!groupedOrders[item.order_id]) {
                groupedOrders[item.order_id] = {
                    ...item.orders,
                    seller_items: []
                };
            }
            groupedOrders[item.order_id].seller_items.push({
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price
            });
        });

        return Object.values(groupedOrders);
    },

    async updateOrderStatus(orderId: string, status: string) {
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
