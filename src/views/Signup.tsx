import React from "react";
import { Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";

import { AuthContext } from "components";
import signUp from "api/signUp";

import "styles/Signup.scss";

class Signup extends React.Component {
  state = {
    signupData: {
      user_name: "",
      password: "",
      user_email: "",
    },
    isSignup: false,
    isValidated: false,
    isLoading: false,
    isSignupFailed: false,
  };

  handleSignupDataChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    const signupData = this.state.signupData;
    if (name === "user_name" || name === "password" || name === "user_email") {
      signupData[name] = value;
    }
    this.setState({ signupData });
  };

  handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.setState({ isLoading: true });

    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      this.setState({ isValidated: true });
    } else {
      this.setState({ isSignupFailed: false, isValidated: false });

      try {
        const result = await signUp(this.state.signupData);
        if (result) {
          console.log("Sign up success!!!");
          this.setState({ isSignup: true });
        } else {
          console.log("Sign up fail!!!");
          this.setState({ isSignupFailed: true });
        }
      } catch (error) {
        console.log(error);
      }
    }

    this.setState({ isLoading: false });
  };

  render() {
    if (this.state.isSignup) {
      return <Redirect to="/signin" />;
    }

    if (this.context.loggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <div className="signup-container">
        <div className="form-container">
          <div className="form-card">
            <Form
              noValidate
              validated={this.state.isValidated}
              onSubmit={this.handleSignup}
            >
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  required
                  type="username"
                  placeholder="Enter username"
                  name="user_name"
                  onChange={this.handleSignupDataChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please input a username.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Enter email"
                  name="user_email"
                  onChange={this.handleSignupDataChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please input an email.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={this.handleSignupDataChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please input a password.
                </Form.Control.Feedback>
              </Form.Group>
              {this.state.isSignupFailed ? (
                <Form.Text className="text-danger">
                  Sign up failed! Please input your username, email and password
                  again.
                </Form.Text>
              ) : (
                ""
              )}
              <div className="content-right">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={this.state.isLoading}
                >
                  Sign up
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

Signup.contextType = AuthContext;

export default Signup;
