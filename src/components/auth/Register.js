import React, { useState } from "react";
import firebase from "../../firebase/firebase";
import {
  Header,
  Button,
  Grid,
  Form,
  Segment,
  Message,
  Icon
} from "semantic-ui-react";

import { Link } from "react-router-dom";

const Register = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    passwordconfirm: "",
    loading: false,
    errors: []
  });

  const { username, email, password, passwordconfirm, errors, loading } = state;

  const errorSetter = error => {
    setState({
      ...state,
      errors: [{ message: error }]
    });
  };

  const displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  const showInputErrorClass = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  const handleOnChange = ({ target: { value, name } }) => {
    setState({
      ...state,
      [name]: value
    });
  };

  const isFormEmpty = ({ username, password, passwordconfirm, email }) => {
    return Object.keys({ username, password, passwordconfirm, email }).every(
      key => !!state[key]
    );
  };

  const isPasswordValid = ({ password, passwordconfirm }) => {
    if (password.length < 6 || passwordconfirm.length < 6) {
      return false;
    }
    return password === passwordconfirm;
  };

  const isFormValid = () => {
    if (!isFormEmpty(state)) {
      errorSetter("Fill in all fields");
      return false;
    }

    if (!isPasswordValid(state)) {
      errorSetter("Password is invalid");
      return false;
    }
    return true;
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (isFormValid()) {
      //clear errors and show preloader
      setState({ ...state, errors: [], loading: true });

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          //stop loading
          setState({ ...state, loading: false });
          console.log(user);
        })
        .catch(error => {
          const { message } = error;
          setState({
            ...state,
            errors: [{ message }],
            loading: false
          });
        });
    }
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for WorkChat
        </Header>

        <Form onSubmit={handleSubmit} size="large">
          <Segment stacked>
            <Form.Input
              type="text"
              value={username}
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              onChange={handleOnChange}
            />

            <Form.Input
              type="email"
              value={email}
              name="email"
              icon="mail"
              className={showInputErrorClass(errors, "email")}
              iconPosition="left"
              placeholder="Email Address"
              onChange={handleOnChange}
            />

            <Form.Input
              type="password"
              value={password}
              name="password"
              icon="lock"
              className={showInputErrorClass(errors, "password")}
              iconPosition="left"
              placeholder="Password"
              onChange={handleOnChange}
            />

            <Form.Input
              type="password"
              value={passwordconfirm}
              name="passwordconfirm"
              icon="repeat"
              className={showInputErrorClass(errors, "password")}
              iconPosition="left"
              placeholder="Confirm Password"
              onChange={handleOnChange}
            />

            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              type="submit"
              color="orange"
              fluid
              size="large"
            >
              Sign Up
            </Button>
          </Segment>
        </Form>
        {errors.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors(errors)}
          </Message>
        )}
        <Message>
          Already A User? <Link to="login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
