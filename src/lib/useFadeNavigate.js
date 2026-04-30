import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

// Mimics the original site's page-out fade. Adds a class to a wrapper
// element (selector configurable, defaults to .page) for ~260ms, then navigates.
export function useFadeNavigate() {
  const navigate = useNavigate();
  return useCallback((to, opts) => {
    const el = document.querySelector('.page');
    if (el) el.classList.add('page-out');
    setTimeout(() => navigate(to, opts), 260);
  }, [navigate]);
}
