import { useEffect, useState } from 'react';
import { getJSON, setJSON } from '../utils/storage';

/** useState that persists its value to localStorage as JSON. */
const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => getJSON(key, initialValue));

    useEffect(() => { setJSON(key, value); }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;
