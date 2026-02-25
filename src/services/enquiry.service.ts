import { supabase } from '../lib/supabase';

export interface Enquiry {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: 'open' | 'closed';
    created_at: string;
    updated_at: string;
}

export const enquiryService = {
    async submitEnquiry(data: Omit<Enquiry, 'id' | 'status' | 'created_at' | 'updated_at'>) {
        const { error } = await supabase
            .from('contact_enquiries')
            .insert([data]);

        if (error) throw error;
        return true;
    },

    async getEnquiries() {
        const { data, error } = await supabase
            .from('contact_enquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Enquiry[];
    },

    async updateEnquiryStatus(id: string, status: 'open' | 'closed') {
        const { data, error } = await supabase
            .from('contact_enquiries')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Enquiry;
    },

    async deleteEnquiry(id: string) {
        const { error } = await supabase
            .from('contact_enquiries')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
