import React from "react";
import ReactDOM from "react-dom";
import Root from "./routes/Root";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "./redux/store";

import "semantic-ui-css/semantic.min.css";

const store = configureStore();

ReactDOM.render(
  <ReduxProvider store={store}>
    <Router>
      <Root />
    </Router>
  </ReduxProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
