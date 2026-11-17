import { useCallback, useState } from 'react';
import { STORAGE_KEYS } from '../config/constants';
import { getJSON, removeItem, setItem, setJSON } from '../utils/storage';

/** Current user + token, persisted to localStorage. */
const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(() => getJSON(STORAGE_KEYS.USER, null));

    const updateUser = useCallback((user) => {
        setCurrentUser(user);
        setJSON(STORAGE_KEYS.USER, user);
    }, []);

    const login = useCallback((token, user) => {
        setItem(STORAGE_KEYS.TOKEN, token);
        updateUser({ ...user, wishlist: user.wishlist || [] });
    }, [updateUser]);

    const logout = useCallback(() => {
        removeItem(STORAGE_KEYS.TOKEN);
        removeItem(STORAGE_KEYS.USER);
        setCurrentUser(null);
    }, []);

    return { currentUser, login, logout, updateUser };
};

export default useAuth;
