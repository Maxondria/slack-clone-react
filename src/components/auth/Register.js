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
    passwordconfirm: ""
  });

  const { username, email, password, passwordconfirm } = state;

  const handleOnChange = ({ target: { value, name } }) => {
    setState({
      ...state,
      [name]: value
    });
  };

  const handleSubmit = event => {
    event.preventDefault();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        console.log(user);
      })
      .catch(error => console.error(error));
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
              iconPosition="left"
              placeholder="Email Address"
              onChange={handleOnChange}
            />

            <Form.Input
              type="password"
              value={password}
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              onChange={handleOnChange}
            />

            <Form.Input
              type="password"
              value={passwordconfirm}
              name="passwordconfirm"
              icon="repeat"
              iconPosition="left"
              placeholder="Confirm Password"
              onChange={handleOnChange}
            />

            <Button type="submit" color="orange" fluid size="large">
              Sign Up
            </Button>

            <Message>
              Already A User? <Link to="login">Login</Link>
            </Message>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
