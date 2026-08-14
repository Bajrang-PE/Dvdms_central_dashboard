import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { decryptData, encryptData } from './modules/login-war/utils/SecurityConfig';
import { LoginContext } from './modules/login-war/context/LoginContext';

const Auth = ({ comp: Component }) => {
    const { isExpired, setIsExpired } = useContext(LoginContext);
    const navigate = useNavigate();
    const sessionData = localStorage.getItem('data');
    const userData = sessionData ? decryptData(sessionData) : null;


    const timerRef = useRef(null);
    const timeout = 60000 * 60; // 60 mins

    const expiredSessionHandler = () => {
        const auth = {
            'isLogin': false,
            // 'username': userData?.username,
            // 'userSeatId': userData?.userSeatId,
            // 'hospitalCode': userData?.hospitalCode,
            // 'userId': userData?.userId,
            'isExpired': "Yes"
        }
        setIsExpired(true);
        localStorage.setItem('data', encryptData(JSON.stringify(auth)));
    }

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        Cookies.remove('csrfToken');
        // navigate('/dvdms/session-expired', { replace: true });
        expiredSessionHandler()
    };

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(logout, timeout);
    };

    useEffect(() => {
        if (userData?.isExpired === 'Yes') {
            setIsExpired(true);
            return;
        }
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
