/* eslint-disable import/no-cycle */
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    cart: cartReducer,
  });
}
