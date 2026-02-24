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

    async updateUserStatus(userId: string, is_active: boolean) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ is_active })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Platform Analytics
    async getPlatformStats() {
        const { count: usersCount } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true });

        const { count: productsCount } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true });

        const { count: ordersCount } = await supabase
            .from('orders')
            .select('id', { count: 'exact', head: true });

        const { count: pendingOrdersCount } = await supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending');

        const { count: sellersCount } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'seller');

        const { count: pendingSellersCount } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'seller')
            .eq('is_verified_seller', false);

        const { data: revenueData } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('status', 'delivered');

        const totalRevenue = revenueData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

        return {
            totalUsers: usersCount || 0,
            totalProducts: productsCount || 0,
            totalOrders: ordersCount || 0,
            pendingOrders: pendingOrdersCount || 0,
            totalSellers: sellersCount || 0,
            pendingSellers: pendingSellersCount || 0,
            totalRevenue: totalRevenue
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
            .select('*, order_items(*, products(seller_id, profiles(store_name)))')
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
    },

    // Blog Management
    async getAllBlogsAdmin() {
        const { data, error } = await supabase
            .from('blogs')
            .select('*, author:profiles(full_name)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async createBlog(blog: Partial<Blog>) {
        const { data, error } = await supabase
            .from('blogs')
            .insert([blog])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateBlog(id: string, updates: Partial<Blog>) {
        const { data, error } = await supabase
            .from('blogs')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteBlog(id: string) {
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async uploadBlogImage(file: File) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const filePath = `blogs/${fileName}`;

        const { data, error } = await supabase.storage
            .from('naadan-hub')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('naadan-hub')
            .getPublicUrl(filePath);

        return publicUrl;
    }
};

export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string;
    featured_image: string;
    author_id: string;
    status: 'draft' | 'published' | 'archived';
    created_at: string;
    updated_at: string;
    author?: {
        full_name: string;
    };
}
