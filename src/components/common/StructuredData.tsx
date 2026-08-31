import { useEffect } from 'react';

/** Injects a JSON-LD <script> tag for the given structured-data object, scoped to this component's lifetime. */
export function StructuredData({ id, data }: { id: string; data: Record<string, unknown> }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [id, data]);

  return null;
}
