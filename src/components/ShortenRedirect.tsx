import React from "react";
import { Jumbotron, Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

const ShortenRedirect: React.FunctionComponent = () => {
  const { shorten } = useParams<{ shorten: string }>();
  window.location.replace(`${process.env.REACT_APP_BASE_URL}${shorten}`);
  return (
    <Jumbotron fluid style={{ background: "none" }}>
      <Row className="justify-content-md-center">
        <Spinner animation="border" variant="primary" />
      </Row>
      <Row className="justify-content-md-center">
        <h1>Redirecting...</h1>
      </Row>
    </Jumbotron>
  );
};

export default ShortenRedirect;
