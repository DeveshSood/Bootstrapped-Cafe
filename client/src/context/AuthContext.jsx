import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiLogin, apiRegister, apiGetProfile, apiUpdateProfile,
         apiAddAddress, apiUpdateAddress, apiDeleteAddress, apiSetDefaultAddress } from '../utils/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'bc_auth_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  // On mount (and when token changes), validate and load profile
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
        // Token expired or invalid — clear it
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

  const deleteAddress = useCallback(async (addressId) => {
    const data = await apiDeleteAddress(token, addressId);
    setUser(prev => ({ ...prev, addresses: data.addresses }));
    return data.addresses;
  }, [token]);

  const setDefaultAddress = useCallback(async (addressId) => {
    const data = await apiSetDefaultAddress(token, addressId);
    setUser(prev => ({ ...prev, addresses: data.addresses }));
    return data.addresses;
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
    updateAddress,
    deleteAddress,
    setDefaultAddress,
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
