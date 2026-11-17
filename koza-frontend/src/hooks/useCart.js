import { useCallback, useMemo, useRef } from 'react';
import { STORAGE_KEYS } from '../config/constants';
import { isOutOfStock } from '../utils/formatters';
import useLocalStorage from './useLocalStorage';

/** Caps a quantity at the product's available stock (when stock is known). */
const clampToStock = (product, quantity) =>
    typeof product.stockAmount === 'number' && product.stockAmount > 0
        ? Math.min(quantity, product.stockAmount)
        : quantity;

/** Shopping-bag state persisted to localStorage. */
const useCart = () => {
    const [cart, setCart] = useLocalStorage(STORAGE_KEYS.CART, []);
    const cartRef = useRef(cart);
    cartRef.current = cart;

    const addToCart = useCallback((product, quantity) => {
        if (isOutOfStock(product)) return;
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: clampToStock(product, item.quantity + quantity) } : item
                );
            }
            return [...prev, { ...product, quantity: clampToStock(product, quantity) }];
        });
    }, [setCart]);

    const updateQuantity = useCallback((productId, quantity) => {
        setCart((prev) => prev
            .map((item) => (item.id === productId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0));
    }, [setCart]);

    const removeFromCart = useCallback((productId) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    }, [setCart]);

    const clearCart = useCallback(() => setCart([]), [setCart]);

    /**
     * Refreshes saved bag items with the latest catalogue data (price, discount, stock)
     * so the customer always pays the current price, and drops items that are no
     * longer sold or out of stock. Returns how many items were removed.
     */
    const syncWithProducts = useCallback((products) => {
        const current = cartRef.current;
        if (!products.length || !current.length) return 0;

        const byId = new Map(products.map((p) => [p.id, p]));
        const next = current
            .filter((item) => {
                const latest = byId.get(item.id);
                return latest && !isOutOfStock(latest);
            })
            .map((item) => {
                const latest = byId.get(item.id);
                return { ...item, ...latest, quantity: clampToStock(latest, item.quantity) };
            });

        setCart(next);
        return current.length - next.length;
    }, [setCart]);

    const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

    return { cart, cartCount, addToCart, updateQuantity, removeFromCart, clearCart, syncWithProducts };
};

export default useCart;
