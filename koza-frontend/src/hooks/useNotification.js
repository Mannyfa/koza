import { useCallback, useEffect, useRef, useState } from 'react';
import { NOTIFICATION_DURATION_MS } from '../config/constants';

/** Toast state that auto-hides; a new message restarts the timer. */
const useNotification = (duration = NOTIFICATION_DURATION_MS) => {
    const [notification, setNotification] = useState({ message: '', show: false });
    const timerRef = useRef(null);

    const showNotification = useCallback((message) => {
        clearTimeout(timerRef.current);
        setNotification({ message, show: true });
        timerRef.current = setTimeout(() => setNotification({ message: '', show: false }), duration);
    }, [duration]);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    return { notification, showNotification };
};

export default useNotification;
