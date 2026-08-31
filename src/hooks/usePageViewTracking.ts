import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '@/services/analytics/track';

export function usePageViewTracking() {
  const location = useLocation();

  useEffect(() => {
    track({ name: 'page_view', path: location.pathname });
  }, [location.pathname]);
}
