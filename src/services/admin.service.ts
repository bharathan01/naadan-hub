import { supabase } from '../lib/supabase';
import { Product } from './product.service';
import { UserProfile } from './auth.service';

export const adminService = {
    // User & Seller Management
    async getAllUsers() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as UserProfile[];
    },

    async updateUserRole(userId: string, role: 'user' | 'seller' | 'admin') {
        const { data, error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async verifySeller(userId: string, isVerified: boolean) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ is_verified_seller: isVerified })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Platform Analytics
    async getPlatformStats() {
        const { data: usersCount, error: userError } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true });

        const { data: productsCount, error: prodError } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true });

        const { data: ordersCount, error: orderError } = await supabase
            .from('orders')
            .select('id', { count: 'exact', head: true });

        if (userError || prodError || orderError) throw (userError || prodError || orderError);

        return {
            totalUsers: usersCount || 0,
            totalProducts: productsCount || 0,
            totalOrders: ordersCount || 0,
            // Add more stats as needed
        };
    },

    // Global Product Management
    async getAllProductsAdmin() {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                seller:profiles(full_name, store_name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as (Product & { seller: { full_name: string; store_name: string } })[];
    },

    async uploadProductImages(files: File[]) {
        const uploadPromises = files.map(async (file) => {
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
            const filePath = `products/${fileName}`;

            const { data, error } = await supabase.storage
                .from('naadan-hub')
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('naadan-hub')
                .getPublicUrl(filePath);

            return publicUrl;
        });

        return Promise.all(uploadPromises);
    },

    async updateProductStatus(id: string, status: Product['status']) {
        const { data, error } = await supabase
            .from('products')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteProductAdmin(id: string) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Category Management
    async createCategory(category: { name: string; slug: string; image_url?: string }) {
        const { data, error } = await supabase
            .from('categories')
            .insert([category])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateCategory(id: string, updates: { name?: string; slug?: string; image_url?: string }) {
        const { data, error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteCategory(id: string) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async uploadCategoryImage(file: File) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const filePath = `categories/${fileName}`;

        const { data, error } = await supabase.storage
            .from('naadan-hub')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('naadan-hub')
            .getPublicUrl(filePath);

        return publicUrl;
    },

    async getAllOrders() {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
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
