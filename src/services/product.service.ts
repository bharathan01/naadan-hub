import { supabase } from '../lib/supabase';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    seller_id: string;
    stock_quantity: number;
    is_verified: boolean;
    status: 'draft' | 'active' | 'inactive' | 'out_of_stock' | 'rejected';
    created_at: string;
    updated_at: string;
}

export const productService = {
    async getProducts(filters?: {
        category?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        from?: number;
        to?: number;
    }) {
        let query = supabase.from('products').select('*', { count: 'exact' });

        if (filters?.category && filters.category !== 'all') {
            query = query.eq('category', filters.category);
        }
        if (filters?.search) {
            query = query.ilike('name', `%${filters.search}%`);
        }
        if (filters?.minPrice) {
            query = query.gte('price', filters.minPrice);
        }
        if (filters?.maxPrice) {
            query = query.lte('price', filters.maxPrice);
        }

        // Sorting
        switch (filters?.sortBy) {
            case 'price-low':
                query = query.order('price', { ascending: true });
                break;
            case 'price-high':
                query = query.order('price', { ascending: false });
                break;
            case 'rating':
                // Assuming we don't have a rating column yet, default to new
                query = query.order('created_at', { ascending: false });
                break;
            default:
                query = query.order('created_at', { ascending: false });
        }

        // Pagination
        if (filters?.from !== undefined && filters?.to !== undefined) {
            query = query.range(filters.from, filters.to);
        }

        const { data, error, count } = await query;
        if (error) throw error;
        return { data: data as Product[], count: count || 0 };
    },

    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    },

    async getProductById(id: string) {
        const { data, error } = await supabase
            .from('products')
            .select('*, profiles(full_name, store_name)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async createProduct(product: Omit<Product, 'id' | 'created_at' | 'is_verified'>) {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateProduct(id: string, updates: Partial<Product>) {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteProduct(id: string) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async createOrder(orderData: any, items: any[]) {
        // 1. Insert Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([orderData])
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Insert Order Items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return order;
    }
};
