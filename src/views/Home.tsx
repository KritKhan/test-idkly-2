import React from "react";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import passwordValidator from "password-validator";

import { shorten } from "api/shorten";
import { AuthContext } from "components";

import "styles/Home.scss";

interface State {
  shortenData: {
    link_original: string;
    link_shorten: string;
  };
  link_shorten: string;
  isShorten: boolean;
  isLoading: boolean;
  isValidated: boolean;
  isShortenFailed: boolean;
  isCopied: boolean;
  warning: string;
}

const validator = new passwordValidator();

validator
  .is().min(5)
  .is().max(12)
  .has().not().spaces()
  .has().not().symbols()

class Home extends React.Component {
  state: State = {
    shortenData: {
      link_original: "",
      link_shorten: "",
    },
    link_shorten: "",
    isShorten: false,
    isLoading: false,
    isValidated: false,
    isShortenFailed: false,
    isCopied: false,
    warning: "",
  };

  handleInputDataChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    const shortenData = this.state.shortenData;
    if (name === "link_original" || name === "link_shorten") {
      shortenData[name] = value;
    }
    this.setState({ shortenData });
  };

  handleShorten = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.setState({ isLoading: true });

    if (this.state.shortenData.link_shorten.length > 0){
      if (!validator.validate(this.state.shortenData.link_shorten)) {
        this.setState({ isShortenFailed: true, isLoading: false, warning: "Your shorten link must be 5-12 charactors with no symbols!" })
        return;
      }
    }
    this.setState({
      isShorten: false,
      link_shorten: "",
      isValidated: false,
      isCopied: false,
      isShortenFailed: false,
      warning: "",
    });

    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      this.setState({ isValidated: true });
    } else {
      this.setState({ isShortenFailed: false, isValidated: false });
      try {
        const result = await shorten(this.state.shortenData);
        if (result === "") {
          // console.log("Shorten failed!!!");
          this.setState({ isShortenFailed: true , warning: "Please try again!"});
        } else if (result === "incorrect") {
          // console.log("The original link is incorrect or the shorten link was taken!!!");
          this.setState({ isShortenFailed: true , warning: "This shorten link was taken!" });
        } else {
          // console.log("Shorten success!!!");
          this.setState({ isShorten: true, warning: "" });
          this.setState({
            link_shorten: process.env.REACT_APP_FRONTEND_URL + ":" + process.env.PORT + "/"  + result,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    this.setState({ isLoading: false });
  };

  copyToClipboard = () => {
    // console.log("Copy success!!!");
    this.setState({ isCopied: true });
  };

  render() {
    return (
      <div className="home-container">
        <div className="card-container">
          <div className="main-card">
            <Form
              noValidate
              validated={this.state.isValidated}
              onSubmit={this.handleShorten}
            >
              {this.context.loggedIn ? (
                <div>
                  <label htmlFor="basic-url">Plate your long URL</label>
                  <InputGroup className="mb-3">
                    <FormControl
                      required
                      type="link_original"
                      // placeholder="Shorten your link"
                      name="link_original"
                      aria-label="Shorten your link"
                      aria-describedby="basic-addon2"
                      onChange={this.handleInputDataChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter link!
                    </Form.Control.Feedback>
                  </InputGroup>

                  <label htmlFor="basic-url">Customize your shorten link (5-12 characters)</label>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>idk.ly/</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      type="link_shorten"
                      placeholder="(Optional)"
                      name="link_shorten"
                      aria-label="Customize your shorten link"
                      aria-describedby="basic-addon2"
                      onChange={this.handleInputDataChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter new shorten link!
                    </Form.Control.Feedback>
                  </InputGroup>

                  <div className="content-right">
                    <Button
                      variant="outline-primary"
                      type="submit"
                      disabled={this.state.isLoading}
                    >
                      Shorten
                    </Button>
                  </div>
                </div>
              ) : (
                <InputGroup className="mb-3">
                  <FormControl
                    required
                    type="link_original"
                    placeholder="Shorten your link"
                    name="link_original"
                    aria-label="Shorten your link"
                    aria-describedby="basic-addon2"
                    onChange={this.handleInputDataChange}
                  />
                  <InputGroup.Append>
                    <Button
                      variant="outline-primary"
                      type="submit"
                      disabled={this.state.isLoading}
                    >
                      Shorten
                    </Button>
                  </InputGroup.Append>

                  <Form.Control.Feedback type="invalid">
                    Please enter link
                  </Form.Control.Feedback>
                </InputGroup>
              )}
              {this.state.isShortenFailed ? (
                <Form.Text className="text-danger">
                  {this.state.warning}
                </Form.Text>
                
              ) : (
                ""
              )}
            </Form>
            <br/>
            {this.state.isShorten ? (
              <InputGroup className="mb-3">
                <Form.Control
                  value={this.state.link_shorten}
                  type="shorten-link"
                  name="link_shorten"
                  disabled
                />
                <InputGroup.Append>
                  <CopyToClipboard
                    text={this.state.link_shorten}
                    onCopy={this.copyToClipboard}
                  >
                    <Button
                      variant="outline-primary"
                      type="copy"
                      disabled={this.state.isLoading}
                    >
                      Copy
                    </Button>
                  </CopyToClipboard>
                </InputGroup.Append>
              </InputGroup>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

Home.contextType = AuthContext;

export default Home;
