import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { selectAuthentic } from '../features/auth/authSlice';

const RouteAuthenticated = ({ component: Component, path }: RouteProps) => {
  const authentic = useSelector(selectAuthentic);

  console.log('AUTH ROUTE');
  if (!authentic) {
    return <Redirect to="/login" />;
  }

  return <Route component={Component} path={path} />;
};

export default RouteAuthenticated;
