import React from "react";
import { withRouter } from "react-router-dom";
import firebase from "../firebase/firebase";
import { connect } from "react-redux";
import { setUser, clearUser } from "../redux/actions";
import Spinner from "./Spinner";
import AppRoutes from "../routes/AppRoutes";

class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
        this.props.clearUser();
      }
    });
  }

  render() {
    return this.props.isLoading ? <Spinner /> : <AppRoutes />;
  }
}

const mapStateToProps = ({ user: { isLoading } }) => ({
  isLoading
});

const AppRouterWithRouter = withRouter(
  connect(
    mapStateToProps,
    { setUser, clearUser }
  )(Root)
);

export default AppRouterWithRouter;
