
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../reducers/reducer";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
    key: "root", // the key under which the state will be persisted
    storage, // the storage engine to use
};
const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer:
        persistedReducer
});
export const persistor = persistStore(store);


export default store;
