// export const initialState = {
//     cart: null,
//     loading: false,
//     error: null,
//     openLogin: false,
// };

// export default function CartReducer(state, action) {
//     switch (action.type) {
//         case "SET_LOADING":
//             return { ...state, loading: action.payload };

//         case "SET_CART":
//             return { ...state, cart: action.payload, loading: false };

//         case "SET_ERROR":
//             return { ...state, error: action.payload, loading: false };

//         case "OPEN_LOGIN":
//             return { ...state, openLogin: true };

//         case "CLOSE_LOGIN":
//             return { ...state, openLogin: false };

//         // ✅ Optimistic update للـ quantity
//         case "UPDATE_ITEM_QUANTITY": {
//             if (!state.cart) return state;
//             const { productId, quantity } = action.payload;
//             const updatedItems = state.cart.items.map((item) => {
//                 const id = item.productId?._id || item.productId;
//                 if (id === productId) return { ...item, quantity };
//                 return item;
//             });
//             const newTotal = updatedItems.reduce(
//                 (sum, item) => sum + item.price * item.quantity,
//                 0
//             );
//             return {
//                 ...state,
//                 cart: { ...state.cart, items: updatedItems, totalAmount: newTotal },
//             };
//         }

//         // ✅ Optimistic remove
//         case "REMOVE_ITEM": {
//             if (!state.cart) return state;
//             const { productId } = action.payload;
//             const updatedItems = state.cart.items.filter((item) => {
//                 const id = item.productId?._id || item.productId;
//                 return id !== productId;
//             });
//             const newTotal = updatedItems.reduce(
//                 (sum, item) => sum + item.price * item.quantity,
//                 0
//             );
//             return {
//                 ...state,
//                 cart: { ...state.cart, items: updatedItems, totalAmount: newTotal },
//             };
//         }

//         default:
//             return state;
//     }
// }
export const initialState = {
    cart: null,
    loading: true,
    error: null,
    openLogin: false,
};

export default function CartReducer(state, action) {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload };

        case "SET_CART":
            return { ...state, cart: action.payload, loading: false };

        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false };

        case "OPEN_LOGIN":
            return { ...state, openLogin: true };

        case "CLOSE_LOGIN":
            return { ...state, openLogin: false };

        // ✅ Optimistic update للـ quantity
        case "UPDATE_ITEM_QUANTITY": {
            if (!state.cart) return state;
            const { productId, quantity } = action.payload;
            const updatedItems = state.cart.items.map((item) => {
                const id = item.productId?._id || item.productId;
                if (id === productId) return { ...item, quantity };
                return item;
            });
            const newTotal = updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            return {
                ...state,
                cart: { ...state.cart, items: updatedItems, totalAmount: newTotal },
            };
        }

        // ✅ Optimistic remove
        case "REMOVE_ITEM": {
            if (!state.cart) return state;
            const { productId } = action.payload;
            const updatedItems = state.cart.items.filter((item) => {
                const id = item.productId?._id || item.productId;
                return id !== productId;
            });
            const newTotal = updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            return {
                ...state,
                cart: { ...state.cart, items: updatedItems, totalAmount: newTotal },
            };
        }

        default:
            return state;
    }
}