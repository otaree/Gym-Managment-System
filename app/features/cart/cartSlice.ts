/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
import { createSlice } from '@reduxjs/toolkit';

import { IProductDocument } from '../../db';
import { RootState } from '../../store';

const cart: { product: IProductDocument; quantity: number }[] = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cart },
  reducers: {
    addProduct: (state, action) => {
      state.cart = [
        ...state.cart,
        { product: action.payload as IProductDocument, quantity: 1 },
      ];
    },
    removeProduct: (state, action) => {
      state.cart = state.cart.filter(
        // eslint-disable-next-line prettier/prettier
        (item) => item.product._id !== action.payload
      );
    },
    incrementItem: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.product._id === action.payload)
          return { ...item, quantity: item.quantity + 1 };
        return item;
      });
    },
    decrementItem: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.product._id === action.payload)
          return { ...item, quantity: item.quantity - 1 };
        return item;
      });
    },
    resetCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  addProduct,
  removeProduct,
  incrementItem,
  decrementItem,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCart = (state: RootState) => state.cart.cart;
