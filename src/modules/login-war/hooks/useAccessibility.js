import { useState, useEffect } from 'react';

export const useAccessibility = () => {
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('site-theme') || 'blue');
    const [language, setLanguage] = useState(localStorage.getItem('site-lang') || 'en');
    const [showCalendar, setShowCalendar] = useState(false);

    // जब भी थीम बदलेगी, Body टैग पर क्लास लग जाएगी (e.g., theme-blue)
    useEffect(() => {
        document.body.className = `theme-${currentTheme}`;
        localStorage.setItem('site-theme', currentTheme);
    }, [currentTheme]);

    useEffect(() => {
        localStorage.setItem('site-lang', language);
    }, [language]);

    const themeOptions = [
        { id: 'red', color: '#cc0000', label: 'Red' },
        { id: 'blue', color: '#0052cc', label: 'Blue' },
        { id: 'green', color: '#008000', label: 'Green' }
    ];

    return {
        currentTheme,
        setCurrentTheme,
        language,
        setLanguage,
        showCalendar,
        setShowCalendar,
        themeOptions
    };
};