import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import App from "../components/App";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import firebase from "../firebase/firebase";
import { connect } from "react-redux";
import { setUser } from "../redux/actions";

class AppRouter extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.history.push("/");
        this.props.setUser(user);
      }
    });
  }

  render() {
    return (
      <Switch>
        <Route path="/" component={App} exact />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const AppRouterWithRouter = withRouter(
  connect(
    undefined,
    { setUser }
  )(AppRouter)
);

export default AppRouterWithRouter;
