import React from "react";
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
  const handleOnChange = () => {};
  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for WorkChat
        </Header>

        <Form size="large">
          <Segment stacked>
            <Form.Input
              fluid
              type="text"
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              onChange={handleOnChange}
            />

            <Form.Input
              fluid
              type="email"
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email Address"
              onChange={handleOnChange}
            />

            <Form.Input
              fluid
              type="password"
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              onChange={handleOnChange}
            />

            <Form.Input
              fluid
              type="password"
              name="passwordConfirm"
              icon="repeat"
              iconPosition="left"
              placeholder="Confirm Password"
              onChange={handleOnChange}
            />

            <Button color="orange" fluid size="large">
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
