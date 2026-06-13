
export const initialState = {
    cart: null,
    loading: false,
    error: null,
    openLogin: false,
};

export default function CartReducer(state, action) {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload };

        case "SET_CART":
            return {
                ...state,
                cart: action.payload,
                loading: false,
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        case "OPEN_LOGIN":
            return {
                ...state,
                openLogin: true,
            };

        case "CLOSE_LOGIN":
            return {
                ...state,
                openLogin: false,
            };

        default:
            return state;
    }
}