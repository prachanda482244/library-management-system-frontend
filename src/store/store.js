import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";
import searchSlice from "./slices/searchSlice";
import socketSlice from "./slices/socketSlice";
import cartSlice from "./slices/cartSlice";


const rootReducer = combineReducers({
    user: authSlice,
    cart: cartSlice,
    search: searchSlice,
    socket: socketSlice,
});

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);