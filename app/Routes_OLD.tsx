/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import { selectAuthentic } from './features/auth/authSlice';

export default function Routes() {
  const authentic = useSelector(selectAuthentic);

  return (
    <App>
      <Switch>
        <Route
          path={routes.HOME}
          render={() => {
            return authentic ? <HomePage /> : <LoginPage />;
          }}
          exact
        />
        <Route path={routes.LOGIN} component={LoginPage} exact />
        {/* <Redirect from="/" to={routes.HOME} /> */}
      </Switch>
    </App>
  );
}
