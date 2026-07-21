import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { decryptData } from './modules/login-war/utils/SecurityConfig';

const Auth = ({ comp: Component }) => {
    const navigate = useNavigate();
    const sessionData = localStorage.getItem('data');
    const userData = sessionData ? decryptData(sessionData) : null;

    const timerRef = useRef(null);
    const timeout = 60000 * 20; // 20 mins

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        Cookies.remove('csrfToken');
        navigate('/dvdms/session-expired', { replace: true });
    };

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(logout, timeout);
    };

    useEffect(() => {
        if (!(userData?.isLogin === 'true' || userData?.isLogin === true)) {
            navigate('/dvdms/', { replace: true });
            return;
        }

        resetTimer();
        const events = [
            'mousemove',
            'mousedown',
            'keypress',
            'scroll',
            'touchstart',
            'click',
            'resize',
        ];
        const handleActivity = () => resetTimer();

        events.forEach(event => window.addEventListener(event, handleActivity));

        return () => {
            clearTimeout(timerRef.current);
            events.forEach(event =>
                window.removeEventListener(event, handleActivity)
            );
        };
    }, [userData]);

    //  Don't put navigate() directly in JSX
    if (!(userData?.isLogin === 'true' || userData?.isLogin === true)) {
        return null;
    }

    return <Component />;
};

export default React.memo(Auth);
