import React from 'react';
import { Redirect } from "react-router-dom";
import { Route } from 'react-router-dom';

import { isUserAuthenticated, getLoggedInUser } from './helpers/authUtils';


// lazy load all the views
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Tables = React.lazy(() => import('./pages/Tables.js'));


// auth
const Login = React.lazy(() => import('./pages/auth/Login'));
const Logout = React.lazy(() => import('./pages/auth/Logout'));
const ForgetPassword = React.lazy(() => import('./pages/account/ForgetPassword'));
const Register = React.lazy(() => import('./pages/account/Register'));
const ConfirmAccount = React.lazy(() => import('./pages/account/Confirm'));
const form = React.lazy(() => import('./components/graphForm.js'));
const lineGraph = React.lazy(() => import('./components/LineGraph.js'));
const barGraph = React.lazy(() => import('./components/BarGraph.js'));
const TableForm = React.lazy(() => import('./components/TableForm.js'));
<<<<<<< HEAD
const Pie = React.lazy(() => import('./components/Pie.js'));


=======
const historicForm = React.lazy(() => import('./components/HistoricGraphForm.js'));
const historicLineGraph = React.lazy(() => import('./components/HistoricLineGraph.js'));
const SearchResult = React.lazy(() => import('./pages/SearchResult'))
>>>>>>> 6c5dfbfffc8cefe6f2ad0e112d35399909894ba1
// handle auth and authorization

const PrivateRoute = ({ component: Component, roles, ...rest }) => (
  <Route {...rest} render={props => {
    const isAuthTokenValid = isUserAuthenticated();
    if (!isAuthTokenValid) {
      // not logged in so redirect to login page with the return url
      return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    }

    const loggedInUser = getLoggedInUser();
    // check if route is restricted by role
    if (roles && roles.indexOf(loggedInUser.role) === -1) {
      // role not authorised so redirect to home page
      return <Redirect to={{ pathname: '/' }} />
    }

    // authorised so return component
    return <Component {...props} />
  }} />
)

const routes = [
  // auth and account
  { path: '/login', name: 'Login', component: Login, route: Route },
  { path: '/logout', name: 'Logout', component: Logout, route: Route },
  { path: '/forget-password', name: 'Forget Password', component: ForgetPassword, route: Route },
  { path: '/register', name: 'Register', component: Register, route: Route },
  { path: '/search_results', name: 'SearchResult', component: SearchResult,route: PrivateRoute, title: "Search Results" },
  { path: '/confirm', name: 'Confirm', component: ConfirmAccount, route: Route },
  { path: '/form', name: 'Form', component: form, route: Route },
  { path: '/lineGraph', name: 'LineGraph', component: lineGraph, route: Route },
   { path: '/barGraph', name: 'BarGraph', component: barGraph, route: Route },
   { path: '/TableForm', name: 'TableForm', component: TableForm, route: Route },
   { path: '/Tables', name: 'Tables', component: Tables, route: Route },
   { path: '/Pie', name: 'Pie', component: Pie, route: Route },

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
