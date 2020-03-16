import React from 'react';
import { Redirect } from "react-router-dom";
import { Route } from 'react-router-dom';

import { isUserAuthenticated, getLoggedInUser} from './helpers/authUtils';


// lazy load all the views
const Dashboard = React.lazy(() => import('./pages/Dashboard'));


// auth
const Login = React.lazy(() => import('./pages/auth/Login'));
const Logout = React.lazy(() => import('./pages/auth/Logout'));
const SearchResult = React.lazy(() => import('./pages/SearchResult'))
const MetricAlert = React.lazy(() => import('./pages/MetricAlert.js'));

// handle auth and authorization

const PrivateRoute = ({ component: Component, roles, ...rest }) => (
  <Route {...rest} render={props => {
    const isAuthTokenValid = isUserAuthenticated();
    if (!isAuthTokenValid) {
      // not logged in so redirect to login page with the return url
      return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    }

    // authorised so return component
    return <Component {...props} />
  }} />
)

const routes = [
  // auth and account
  { path: '/login', name: 'Login', component: Login, route: Route },
  { path: '/logout', name: 'Logout', component: Logout, route: Route },
  { path: '/search_results', name: 'SearchResult', component: SearchResult,route: PrivateRoute, title: "Search Results" },
   {path: '/metricAlert', name: 'MetricAlert', component: MetricAlert, route:Route, title:"Metric Alerts"},
  
  // other pages
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, route: PrivateRoute, roles: ['Admin'], title: 'Dashboard' },
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/dashboard" />,
    route: PrivateRoute
  },

]

export { routes, PrivateRoute };
