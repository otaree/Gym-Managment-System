import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { selectAuthentic } from '../features/auth/authSlice';

const RouteUnauthenticated = ({ component: Component, path }: RouteProps) => {
  const authentic = useSelector(selectAuthentic);

  console.log('UNAUTH ROUTE');
  if (authentic) {
    return <Redirect to="/" />;
  }

  return <Route component={Component} path={path} />;
};

export default RouteUnauthenticated;
