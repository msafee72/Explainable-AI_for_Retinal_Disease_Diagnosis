import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../../../Services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const checkLoggedIn = async () => {
      try {
        // Get user from localStorage first
        const localUser = authService.getCurrentUser();
        
        if (localUser) {
          setCurrentUser(localUser);
          
          // Optionally fetch fresh user data from server
          try {
            const freshUserData = await authService.getMe();
            setCurrentUser(freshUserData);
          } catch (error) {
            console.log("Couldn't refresh user data, using cached data");
          }
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setCurrentUser(response.user); // api.js stores user data in localStorage
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw to handle in the component
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      setCurrentUser(response.user);
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      console.log("Sending profile data to API:", profileData);
      const updatedProfile = await authService.updateProfile(profileData);
      console.log("API response:", updatedProfile);
      
      
      setCurrentUser(prevUser => ({ ...prevUser, ...updatedProfile }));
      
      return updatedProfile;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const refreshUserData = async () => {
    try {
      const userData = await authService.getMe();
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      throw error;
    }
  };

  const getDoctorProfile = async () => {
    try {
      const response = await authService.getMe();
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    signup, // Changed from register to signup to match API
    logout,
    updateProfile, // Added this function
    refreshUserData, // Added this function
    getDoctorProfile ,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 