import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiLogin, apiRegister, apiGetProfile, apiUpdateProfile,
         apiAddAddress, apiUpdateAddress, apiDeleteAddress, apiSetDefaultAddress,
         apiSaveCustomBowl, apiDeleteCustomBowl, apiUpdateCustomBowl } from '../utils/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'bc_auth_token';

/**
 * AuthProvider — Manages authentication state, profile data, and address CRUD.
 * Persists JWT to localStorage and auto-validates on mount.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiGetProfile(token)
      .then(data => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await apiRegister(name, email, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const data = await apiUpdateProfile(token, updates);
    setUser(data.user);
    return data.user;
  }, [token]);

  const addAddress = useCallback(async (address) => {
    const data = await apiAddAddress(token, address);
    setUser(prev => ({ ...prev, addresses: data.addresses }));
    return data.addresses;
  }, [token]);

  const updateAddress = useCallback(async (addressId, updates) => {
    const data = await apiUpdateAddress(token, addressId, updates);
    setUser(prev => ({ ...prev, addresses: data.addresses }));
    return data.addresses;
  }, [token]);

  const deleteAddress = useCallback(async (id) => {
    const data = await apiDeleteAddress(token, id);
    setUser(prev => ({ ...prev, addresses: data.addresses }));
  }, [token]);

  const setDefaultAddress = useCallback(async (id) => {
    const data = await apiSetDefaultAddress(token, id);
    setUser(prev => ({ ...prev, addresses: data.addresses }));
  }, [token]);

  const saveCustomBowl = useCallback(async (bowlData) => {
    const data = await apiSaveCustomBowl(token, bowlData);
    setUser(prev => ({ ...prev, savedBowls: data.savedBowls }));
    return data.savedBowls;
  }, [token]);

  const deleteCustomBowl = useCallback(async (bowlId) => {
    const data = await apiDeleteCustomBowl(token, bowlId);
    setUser(prev => ({ ...prev, savedBowls: data.savedBowls }));
    return data.savedBowls;
  }, [token]);

  const updateCustomBowl = useCallback(async (bowlId, bowlData) => {
    const data = await apiUpdateCustomBowl(token, bowlId, bowlData);
    setUser(prev => ({ ...prev, savedBowls: data.savedBowls }));
    return data.savedBowls;
  }, [token]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isRestaurant: user?.role === 'restaurant',
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'restaurant' || user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    addAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    saveCustomBowl,
    deleteCustomBowl,
    updateCustomBowl,
    deleteCustomBowl,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
