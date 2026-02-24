import { supabase } from '../lib/supabase';

export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string;
    featured_image: string;
    status: 'draft' | 'published' | 'archived';
    author_id: string;
    created_at: string;
    updated_at: string;
    author?: {
        full_name: string;
    };
}

export const blogService = {
    async getPublishedBlogs() {
        const { data, error } = await supabase
            .from('blogs')
            .select('*, author:profiles(full_name)')
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Blog[];
    },

    async getBlogBySlug(slug: string) {
        const { data, error } = await supabase
            .from('blogs')
            .select('*, author:profiles(full_name)')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (error) throw error;
        return data as Blog;
    },

    async getBlogById(id: string) {
        const { data, error } = await supabase
            .from('blogs')
            .select('*, author:profiles(full_name)')
            .eq('id', id)
            .eq('status', 'published')
            .single();

        if (error) throw error;
        return data as Blog;
    },

    async getLatestBlogs(limit = 3) {
        const { data, error } = await supabase
            .from('blogs')
            .select('*, author:profiles(full_name)')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data as Blog[];
    }
};
