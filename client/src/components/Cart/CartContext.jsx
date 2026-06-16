import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiSyncCart, apiGetCart } from '../../utils/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      const incomingQuantity = action.payload.quantity || 1;
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + incomingQuantity } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: incomingQuantity }] };
    }
    case 'ADD_ITEMS': {
      let currentItems = [...state.items];
      const newItems = action.payload;
      
      for (const newItem of newItems) {
        const existingIndex = currentItems.findIndex(i => i.id === newItem.id);
        const incomingQuantity = newItem.quantity || 1;
        
        if (existingIndex !== -1) {
          currentItems[existingIndex] = {
            ...currentItems[existingIndex],
            quantity: currentItems[existingIndex].quantity + incomingQuantity
          };
        } else {
          currentItems.push({ ...newItem, quantity: incomingQuantity });
        }
      }
      return { ...state, items: currentItems };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: Math.max(0, action.payload.quantity) } : i
        ).filter(i => i.quantity > 0),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const { user, token } = useAuth();
  const syncTimeout = useRef(null);
  const hasLoadedServerCart = useRef(false);

  // When user logs in, merge local cart with server cart
  useEffect(() => {
    if (!user || !token) {
      hasLoadedServerCart.current = false;
      return;
    }
    if (hasLoadedServerCart.current) return;

    apiGetCart(token)
      .then(data => {
        const serverCart = (data.cart || []).map(item => ({
          id: item.menuItem || item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        }));

        // Merge: local items take priority, server fills the rest
        const localItems = state.items;
        const merged = [...localItems];
        for (const serverItem of serverCart) {
          if (!merged.find(m => m.id === serverItem.id)) {
            merged.push(serverItem);
          }
        }

        dispatch({ type: 'SET_CART', payload: merged });
        hasLoadedServerCart.current = true;
      })
      .catch(() => {
        // Server cart load failed — keep local cart
        hasLoadedServerCart.current = true;
      });
  }, [user, token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced sync to server whenever cart changes (only if logged in)
  useEffect(() => {
    if (!user || !token || !hasLoadedServerCart.current) return;

    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(() => {
      const cartForServer = state.items.map(item => ({
        menuItem: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      }));
      apiSyncCart(token, cartForServer).catch(() => {
        // Silent fail — cart sync is best-effort
      });
    }, 800);

    return () => {
      if (syncTimeout.current) clearTimeout(syncTimeout.current);
    };
  }, [state.items, user, token]);

  const addItem = useCallback((item) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
  const addItems = useCallback((items) => dispatch({ type: 'ADD_ITEMS', payload: items }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', payload: id }), []);
  const updateQuantity = useCallback((id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{ items: state.items, addItem, addItems, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export default CartContext;
