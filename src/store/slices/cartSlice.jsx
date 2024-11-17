import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import  { addBookToCart, clearBookToCart, fetchBookCart, removeBookFromCart, updateBookToCart } from "../../config/AxiosInstance";

const initialState = {
  error: null,
  cartItems: [],
  status: "idle",
  message: null,
};
export const fetchCartData = createAsyncThunk("cart/item", async () => {
  const { data } = await fetchBookCart();
  return data.data;
});

export const addToCart = createAsyncThunk(
  "cart/add-to-cart",
  async (bookId, book) => {
    const { data } = await addBookToCart({bookId,book}) 
    return data.data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (bookId) => {
    const { data } = await 
    removeBookFromCart({bookId})
    return data.data;
  }
);
export const updateCart = createAsyncThunk(
  "cart/update",
  async ({ bookId, quantity }) => {
    const { data } = await updateBookToCart({bookId,quantity})
    console.log(data,"Update cart")
    
    return data.data;
  }
);
export const clearCart = createAsyncThunk("cart/clear", async () => {
  const { data } = await clearBookToCart()
  return data.data.message;
});

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.status = "idle";
        state.cartItems = action.payload;
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "idle";
        state.cartItems = action.payload;
      })
      .addCase(updateCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.status = "idle";
        state.cartItems = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "idle";
        state.cartItems = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = "idle";
        state.cartItems = [];
      });
  },
});

export default cartSlice.reducer;