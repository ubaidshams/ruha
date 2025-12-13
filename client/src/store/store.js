import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import cartSlice from "./slices/cartSlice";
import productsSlice from "./slices/productsSlice";
import filterSlice from "./slices/filterSlice";
import builderSlice from "./slices/builderSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    products: productsSlice,
    filters: filterSlice,
    builder: builderSlice,
    user: userSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
