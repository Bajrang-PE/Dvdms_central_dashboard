import { useState, useEffect } from 'react';

const useScrollVisibility = (elementId, offset = 100) => {
    const [isVisible, setIsVisible] = useState(false);

    const checkScroll = () => {
        const element = document.getElementById(elementId);
        if (element) {
            const top = element.getBoundingClientRect().top;
            setIsVisible(top < window.innerHeight - offset);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', checkScroll);
        checkScroll(); 
        return () => window.removeEventListener('scroll', checkScroll);
    }, [elementId, offset]);

    return isVisible;
};

export default useScrollVisibility;
