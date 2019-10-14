import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from "../components/App";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

export default () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={App} exact />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </Router>
  );
};
