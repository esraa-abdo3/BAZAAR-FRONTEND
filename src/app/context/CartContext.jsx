"use client";

import CartReducer, { initialState } from "./CartReducer";
import {
    createContext,
    useContext,
    useReducer,
    useEffect,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(CartReducer, initialState);

    const getToken = () => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("token");
    };

    const addToCart = async (productId, quantity = 1) => {
        const token = getToken();

        if (!token || token === "undefined" || token === "null") {
            dispatch({ type: "OPEN_LOGIN" });
            return;
        }

        try {
            const res = await fetch(
                "https://bazary-backend.vercel.app/api/events/cart",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ productId }),
                }
            );

            const data = await res.json();
            dispatch({ type: "SET_CART", payload: data.data });
        } catch (err) {
            dispatch({ type: "SET_ERROR", payload: err.message });
        }
    };

    const updateCartQuantity = async (productId, newQuantity) => {
        const token = getToken();
        if (!token) { dispatch({ type: "OPEN_LOGIN" }); return; }

        // ✅ Optimistic update — نحدّث الـ UI فوراً
        dispatch({ type: "UPDATE_ITEM_QUANTITY", payload: { productId, quantity: newQuantity } });

        try {
            const res = await fetch(
                `https://bazary-backend.vercel.app/api/events/cart/${productId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ quantity: newQuantity }),
                }
            );

            const data = await res.json();

            // لو الـ backend رجّع كارت كامل نحدثه، لو لأ نسيب الـ optimistic
            if (data?.data?.items) {
                dispatch({ type: "SET_CART", payload: data.data });
            }
        } catch (err) {
            // لو فشل نرجع بـ getCart
            await getCart();
            dispatch({ type: "SET_ERROR", payload: err.message });
        }
    };

    const removeFromCart = async (productId) => {
        const token = getToken();
        if (!token) { dispatch({ type: "OPEN_LOGIN" }); return; }

        // ✅ Optimistic — نشيل الأيتم فوراً
        dispatch({ type: "REMOVE_ITEM", payload: { productId } });

        try {
            const res = await fetch(
                `https://bazary-backend.vercel.app/api/events/cart/${productId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = await res.json();
            if (data?.data !== undefined) {
                dispatch({ type: "SET_CART", payload: data.data });
            }
        } catch (err) {
            await getCart();
            dispatch({ type: "SET_ERROR", payload: err.message });
        }
    };

    const clearCart = async () => {
        const token = getToken();
        if (!token) { dispatch({ type: "OPEN_LOGIN" }); return; }

        try {
            await fetch("https://bazary-backend.vercel.app/api/events/cart", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch({ type: "SET_CART", payload: null });
        } catch (err) {
            dispatch({ type: "SET_ERROR", payload: err.message });
        }
    };

    const getCart = async () => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(
                "https://bazary-backend.vercel.app/api/events/cart",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            dispatch({ type: "SET_CART", payload: data.data });
        } catch (error) {
            console.log("get my cart", error);
        }
    };

    useEffect(() => { getCart(); }, []);

    const cartCount =
        state.cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <CartContext.Provider
            value={{
                ...state,
                cartCount,
                addToCart,
                getCart,
                removeFromCart,
                updateCartQuantity,
                clearCart,
                closeLogin: () => dispatch({ type: "CLOSE_LOGIN" }),
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);