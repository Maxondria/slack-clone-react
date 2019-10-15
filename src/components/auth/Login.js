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

const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    loading: false,
    errors: []
  });

  const { email, password, errors, loading } = state;

  const displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  const showInputErrorClass = (errors, inputName) =>
    errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";

  const handleOnChange = ({ target: { value, name } }) => {
    setState({
      ...state,
      [name]: value
    });
  };

  const isFormValid = ({ email, password }) => email && password;

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if (isFormValid(state)) {
        setState({ ...state, errors: [], loading: true });

        await firebase.auth().signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      const { message } = error;
      setState({ ...state, errors: [{ message }], loading: false });
    }
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="violet" textAlign="center">
          <Icon name="code branch" color="violet" />
          Login To WorkChat
        </Header>

        <Form onSubmit={handleSubmit} size="large">
          <Segment stacked>
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

            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              type="submit"
              color="violet"
              size="large"
              fluid
            >
              Login
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
          Don't have an account? <Link to="register">Sign Up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
