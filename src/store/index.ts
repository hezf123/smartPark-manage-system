import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./login/authSlice";
import userSlice from "./user/userSlice";
import contractSlice from "./finacial";
export const store = configureStore({
    reducer: {
        authSlice,
        userSlice,
        contractSlice
    }
})