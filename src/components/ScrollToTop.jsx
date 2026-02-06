import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Instant scroll, no smooth animation
        });
    }, [pathname]);

    useEffect(() => {
        // Scroll to top on page load/refresh
        window.scrollTo(0, 0);
    }, []);

    return null;
};

export default ScrollToTop;
