import React from 'react';
import Layout from 'dashboard/index';
import Profile from 'dashboard/profile';
import NotFound from 'dashboard/not-found';
import Authentication from 'dashboard/authentication';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Router, Route, IndexRedirect } from 'react-router';
import isLoggedIn from 'helpers/dashboard/is-logged-in';

let history = createBrowserHistory();

function ensureLogin(nextState, replaceState) {
  var location = window.location;
  var redirectPath = location.pathname + location.search;

  if (!isLoggedIn()) {
    replaceState({ }, '/anmelden', { redirectTo: redirectPath });
  }
}

React.render((
  <Router history={history}>
    <Route path="/" component={Layout}>
      <Route path="dashboard" onEnter={ensureLogin}>
        <IndexRedirect to='profil' />
        <Route path="profil" component={Profile}/>
      </Route>

      <Route path="anmelden" component={Authentication} />
      <Route path="registrieren" component={Authentication} />
    </Route>

    <Route path="*" component={NotFound} />
  </Router>
), document.getElementById('dashboard'));
