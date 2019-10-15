import React from "react";
import { Switch, Route } from "react-router-dom";
import App from "../components/App";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/" component={App} exact />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  );
};

export default AppRoutes;
