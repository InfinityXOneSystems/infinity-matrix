
import React from 'react';

// Authentication disabled globally as requested.
// This component now acts as a transparent pass-through,
// allowing access to all routes without login checks.
const ProtectedRoute = ({ children }) => {
  return children; 
};

export default ProtectedRoute;
