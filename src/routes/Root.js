import React from "react";
import { withRouter } from "react-router-dom";
import firebase from "../firebase/firebase";
import { connect } from "react-redux";
import { setUser } from "../redux/actions";
import Spinner from "../components/Spinner";
import AppRoutes from "./AppRoutes";

class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push("/");
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
    { setUser }
  )(Root)
);

export default AppRouterWithRouter;
