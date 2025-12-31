
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Smooth scroll to top on route change
    // Using 'auto' instead of 'smooth' for page transitions feels snappier and more native-like
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto' 
    });
  }, [pathname]);

  return null;
};
