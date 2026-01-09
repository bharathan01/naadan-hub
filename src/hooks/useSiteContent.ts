import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SiteContent {
  id: string;
  section: string;
  content: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export function useSiteContent(section: string) {
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('site_content')
          .select('*')
          .eq('section', section)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (fetchError) throw fetchError;

        setContent(data && data.length > 0 ? data[0].content : {});
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching site content:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [section]);

  return { content, loading, error };
}
