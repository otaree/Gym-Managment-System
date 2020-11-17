/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import routes from './constants/routes.json';
import App from './containers/App';
import LoginPage from './containers/LoginPage';
import Members from './containers/Members';
import MemberDetails from './containers/MemberDetails';
import AddMemberForm from './containers/AddMemberForm';
import EditMemberForm from './containers/EditMemberForm';
import AllPrepaid from './containers/AllPrepaid';
import PrepaidDetails from './containers/PrepaidDetails';
import AddPrepaid from './containers/AddPrepaid';
import EditPrepaid from './containers/EditPrepaid';
import Products from './containers/Products';
import ProductDetails from './containers/ProductDetails';
import AddProduct from './containers/AddProduct';
import EditProduct from './containers/EditProduct';
import Sales from './containers/Sales';
import SaleDetail from './containers/SaleDetails';
import Cart from './containers/Cart';
import Employees from './containers/Employees';
import EmployeeDetails from './containers/EmployeeDetails';
import AddEmployee from './containers/AddEmployee';
import EditEmployee from './containers/EditEmployee';
import WithAside from './components/WithAside';
import { selectAuthentic } from './features/auth/authSlice';

export default function Routes() {
  const authentic = useSelector(selectAuthentic);

  return (
    <App>
      <Switch>
        <Route
          path="/members"
          render={() => {
            return authentic ? (
              <WithAside>
                <Members />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/members/add"
          render={() => {
            return authentic ? (
              <WithAside>
                <AddMemberForm />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/members/:id/edit"
          render={() => {
            return authentic ? (
              <WithAside>
                <EditMemberForm />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/members/:id/details"
          render={() => {
            return authentic ? (
              <WithAside>
                <MemberDetails />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/prepaid/all"
          render={() => {
            return authentic ? (
              <WithAside>
                <AllPrepaid />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/prepaid/add"
          render={() => {
            return authentic ? (
              <WithAside>
                <AddPrepaid />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/prepaid/:id/edit"
          render={() => {
            return authentic ? (
              <WithAside>
                <EditPrepaid />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/prepaid/:id"
          render={() => {
            return authentic ? (
              <WithAside>
                <PrepaidDetails />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/products"
          render={() => {
            return authentic ? (
              <WithAside>
                <Products />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/products/add"
          render={() => {
            return authentic ? (
              <WithAside>
                <AddProduct />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/products/:id"
          render={() => {
            return authentic ? (
              <WithAside>
                <ProductDetails />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/products/:id/edit"
          render={() => {
            return authentic ? (
              <WithAside>
                <EditProduct />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/sales"
          render={() => {
            return authentic ? (
              <WithAside>
                <Sales />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/sales/:id"
          render={() => {
            return authentic ? (
              <WithAside>
                <SaleDetail />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/cart"
          render={() => {
            return authentic ? (
              <WithAside>
                <Cart />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/employees"
          render={() => {
            return authentic ? (
              <WithAside>
                <Employees />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/employees/add"
          render={() => {
            return authentic ? (
              <WithAside>
                <AddEmployee />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/employees/:id"
          render={() => {
            return authentic ? (
              <WithAside>
                <EmployeeDetails />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Route
          path="/employees/:id/edit"
          render={() => {
            return authentic ? (
              <WithAside>
                <EditEmployee />
              </WithAside>
            ) : (
              <LoginPage />
            );
          }}
          exact
        />
        <Redirect from="/" to="/members" />
      </Switch>
    </App>
  );
}
