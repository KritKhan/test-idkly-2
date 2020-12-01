import React, { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  ListGroup,
  Row,
  Col,
  Container,
  Spinner,
  Dropdown,
  Jumbotron,
} from "react-bootstrap";
import { AiOutlineDelete } from "react-icons/ai";

import { NotFoundIcon } from "components";
import { getShortenLink, getAccessLog, deleteLink } from "api/shorten";

import "styles/Dashboard.scss";

interface ShortenData {
  link_shorten: string;
  link_original: string;
  link_created_datetime: string;
  link_user: number;
  link_access: number;
}

interface LogData {
  date: string[];
  access: number[];
}

function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shortenDatas, setShortenDatas] = useState<Array<ShortenData>>([]);
  const [accessLogs, setAccessLogs] = useState<Record<string, LogData>>({});
  const [selectedLink, setSelectedLink] = useState<number>(0);

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = async () => {
    setIsLoading(true);
    await Promise.all([getData(), getLogs()]);
    setIsLoading(false);
  };

  const getData = async () => {
    const shorten = await getShortenLink();
    setShortenDatas(shorten);
  };

  const getLogs = async () => {
    const logs = await getAccessLog();
    const logsForState: Record<string, LogData> = {};
    logs.forEach((log) => {
      const shortenLink = log.access_log_shorten_url;
      const date: string[] = [];
      const access: number[] = [];
      log.access_data.forEach((data) => {
        const dateDate = new Date(data.access_date).toDateString();
        date.push(dateDate ? dateDate.substring(4) : "");
        access.push(data.access_count);
      });
      logsForState[shortenLink] = {
        date,
        access,
      };
    });
    setAccessLogs(logsForState);
  };

  const handleSelectLink = (index: number) => {
    setSelectedLink(index);
  };

  const handleDeleteLink = async () => {
    if (shortenDatas[selectedLink]) {
      const status = await deleteLink(shortenDatas[selectedLink].link_shorten);
      if (status === 204 || status === 200) {
        await getInitialData();
      } else if (status === 404) {
        console.error("LINK NOT FOUND!");
      } else {
        console.error("Error with status = " + status.toString());
      }
    }
  };

  const chartData = useCallback(() => {
    let selectedShorten;
    let logsFromState: LogData = { date: [], access: [] };
    if (shortenDatas && shortenDatas[selectedLink]) {
      selectedShorten = shortenDatas[selectedLink].link_shorten;
      logsFromState = accessLogs[selectedShorten];
    }

    return {
      labels: logsFromState.date,
      datasets: [
        {
          label:
            "Link access for " +
              process.env.REACT_APP_FRONTEND_URL + ":" + process.env.PORT + "/" +
              selectedShorten || "",
          data: logsFromState.access,
          fill: false,
          backgroundColor: "#004085",
          borderColor: "#b8daff",
        },
      ],
    };
  }, [selectedLink, isLoading]);

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <Jumbotron fluid style={{ background: "none" }}>
          <Row className="justify-content-md-center">
            <Spinner animation="border" variant="primary" />
          </Row>
          <Row className="justify-content-md-center">
            <h1>Loading Data...</h1>
          </Row>
        </Jumbotron>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {shortenDatas.length > 0 ? (
        <>
          <div className="dashboard">
            <Line height={75} data={chartData} />
          </div>
          <Container fluid>
            <Row>
              <Col xs={4} className="link-selector">
                <ListGroup variant="flush" defaultActiveKey="#0">
                  {shortenDatas.map((item, index) => {
                    return (
                      <ListGroup.Item
                        action
                        variant="primary"
                        key={index}
                        href={`#${index}`}
                        onClick={() => handleSelectLink(index)}
                      >
                        <Row className="original">
                          <b>{item.link_original}</b>
                        </Row>
                        <Row className="shorten">
                          {process.env.REACT_APP_FRONTEND_URL + ":" + process.env.PORT + "/"}
                          <b>{item.link_shorten}</b>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Col>
              <Col className="shorten-detail">
                <Row>
                  <Col>
                    <Row className="create-date">
                      CREATED{" "}
                      {new Date(
                        shortenDatas[selectedLink].link_created_datetime
                      )
                        .toUTCString()
                        .toUpperCase()}
                    </Row>
                    <Row className="shorten-link">
                      <a
                        href={
                          process.env.REACT_APP_FRONTEND_URL + ":" + process.env.PORT + "/"  + 
                          shortenDatas[selectedLink].link_shorten
                        }
                      >
                        {process.env.REACT_APP_FRONTEND_URL + ":" + process.env.PORT + "/" }
                        <b>{shortenDatas[selectedLink].link_shorten}</b>
                      </a>
                    </Row>
                    <Row className="original-link">
                      Original URL: {shortenDatas[selectedLink].link_original}
                    </Row>
                    <Dropdown.Divider className="divider" />
                    <Row className="link-access">
                      {shortenDatas[selectedLink].link_access} total clicks
                    </Row>
                  </Col>
                  <Col md={1}>
                    <AiOutlineDelete
                      className="delete-icon"
                      onClick={handleDeleteLink}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <div className="no-shorten-link">
          <NotFoundIcon className="not-found-icon" />
          <div>You have no shorten link!</div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
