import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import cartSlice from "./slices/cartSlice";
import productsSlice from "./slices/productsSlice";
import categoriesSlice from "./slices/categoriesSlice";
import filterSlice from "./slices/filterSlice";
import builderSlice from "./slices/builderSlice";
import userSlice from "./slices/userSlice";
import adminSlice from "./slices/adminSlice";
import uiSlice from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    products: productsSlice,
    categories: categoriesSlice,
    filters: filterSlice,
    builder: builderSlice,
    user: userSlice,
    admin: adminSlice,
    ui: uiSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
