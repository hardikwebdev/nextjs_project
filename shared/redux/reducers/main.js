// import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { cartreducer } from "./reducer";
import { authReducer } from "./reducer";

const rootred = configureStore({
    reducer: {
    cartreducer,
    auth: authReducer,
}});

export default rootred