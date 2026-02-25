import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSiteContent(sectionKey: string) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('site_content')
          .select('content')
          .eq('section_key', sectionKey)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setContent(null);
          } else {
            throw fetchError;
          }
        } else {
          setContent(data.content);
        }
      } catch (err) {
        setError(err as Error);
        console.error(`Error fetching site content for ${sectionKey}:`, err);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [sectionKey]);

  return { content, loading, error };
}
