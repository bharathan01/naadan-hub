import { supabase } from '../lib/supabase';

export const siteService = {
    /**
     * Fetches content for a specific section key
     * @param sectionKey - The key identifying the section (e.g., 'hero_slides', 'footer_info')
     * @returns The content object or null if not found
     */
    async getSiteContent(sectionKey: string) {
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('section_key', sectionKey)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No record found, return null instead of throwing
                return null;
            }
            throw error;
        }
        return data.content;
    },

    /**
     * Updates or creates content for a specific section key
     * @param sectionKey - The key identifying the section
     * @param content - The new content object
     */
    async updateSiteContent(sectionKey: string, content: any) {
        const { data, error } = await supabase
            .from('site_content')
            .upsert(
                { section_key: sectionKey, content, updated_at: new Date().toISOString() },
                { onConflict: 'section_key' }
            )
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Utility to upload an image specifically for site content
     */
    async uploadSiteImage(file: File, folder = 'site') {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const filePath = `${folder}/${fileName}`;

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
