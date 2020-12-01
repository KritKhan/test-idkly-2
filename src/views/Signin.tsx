import React from "react";
import { Button, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";

import signIn from "api/signIn";
import { AuthContext } from "components";

import "styles/Signin.scss";

interface State {
  signinData: {
    usernameEmail: string;
    password: string;
  };
  isLoginFailed: boolean;
  isValidated: boolean;
  isLoading: boolean;
}

class Signin extends React.Component {
  state: State = {
    signinData: {
      usernameEmail: "",
      password: "",
    },
    isLoginFailed: false,
    isValidated: false,
    isLoading: false,
  };
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      this.setState({ isValidated: true });
    } else {
      this.setState({ isLoginFailed: false, isValidated: false });

      try {
        const result = await signIn(this.state.signinData);
        if (result) {
          this._isMounted && this.context.setLoggedIn(true); // this.setState({ isLoggedIn: true });
        } else {
          this.setState({
            signinData: {
              usernameEmail: "",
              password: "",
            },
          });
          this._isMounted && this.setState({ isLoginFailed: true });
        }
      } catch (error) {
        console.log(error);
      }
    }

    this._isMounted && this.setState({ isLoading: false });
  };

  handleSigninDataChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    const signinData = this.state.signinData;
    if (name === "usernameEmail" || name === "password") {
      signinData[name] = value;
    }
    this.setState({ signinData });
  };

  render() {
    if (this.context.loggedIn) {
      return <Redirect to="/" />;
    }

    return (
      <div className="signin-container">
        <div className="form-container">
          <div className="form-card">
            <Form
              noValidate
              validated={this.state.isValidated}
              onSubmit={this.handleSubmit}
            >
              <Form.Group controlId="usernameOrEmail">
                <Form.Label>Username or Email</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter username or email"
                  name="usernameEmail"
                  value={this.state.signinData.usernameEmail}
                  onChange={this.handleSigninDataChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please input a username.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={this.state.signinData.password}
                  onChange={this.handleSigninDataChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please input a password.
                </Form.Control.Feedback>
              </Form.Group>

              {this.state.isLoginFailed ? (
                <Form.Text className="text-danger">
                  Login failed! Please input your username/email and password
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
                  Sign in
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

Signin.contextType = AuthContext;

export default Signin;
