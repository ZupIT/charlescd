import React from 'react'
import moment from 'moment'
import './style.css'
import { Navbar, Container, Row, Col, Card, ListGroup, ListGroupItem, UncontrolledCollapse } from 'reactstrap'
import { useParams, useRouteData, Link } from 'react-suspense-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AceEditor from "react-ace";
import { getDuration } from '../Executions/helper'

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import { getManifestStatusColor } from './helper'

const Execution = () => {
  const {id} = useParams()
  const { result } = useRouteData()

  return (
    <div className="execution">
      <Navbar className="execution__navbar">
        <Container>
          <Link to="/">{result?.name}</Link>
        </Container>
      </Navbar>
      <div className="execution__content">
        <Container>
          <Row>
            <Col md={12}>
              <Card className="execution__content__basic">
                <div><FontAwesomeIcon icon="user" /> {result?.author}</div>
                <div>
                  <FontAwesomeIcon icon="calendar-day" /> {moment.utc(result?.startTime).format("DD/MM/YYYY")}{'  '}
                  <FontAwesomeIcon icon="clock" /> {moment.utc(result?.startTime).format("HH:mm")}
                </div>
                <div>
                  <FontAwesomeIcon icon="calendar-day" /> {moment.utc(result?.finishTime).format("DD/MM/YYYY")}{'  '}
                  <FontAwesomeIcon icon="clock" /> {moment.utc(result?.finishTime).format("HH:mm")}
                </div>
                <div>
                  <FontAwesomeIcon icon="clock" /> {getDuration(result?.startTime, result?.finishTime)}
                </div>
              </Card>
            </Col>
            <div className="execution__content__resume">
              <Col md={12}><strong>Name: </strong>{result?.name}</Col>
              <Col md={12}><strong>Namespace: </strong>{result?.namespace}</Col>
              <Col md={12}><strong>Webhook: </strong>{result?.webhook}</Col>
              <Col md={12}><strong>Image URL: </strong>{result?.imageURL}</Col>
              <Col md={12}><strong>Helm URL: </strong>{result?.helmUrl}</Col>
            </div>
          </Row>
          <h5>Manifests</h5>
          <ListGroup className="execution__content__manifests">
            {result?.manifests?.map(manifest => (
              <>
                <ListGroupItem className="execution__content__manifest" id={`coll-${manifest?.id}`}>
                  <Row>
                    <Col md={2}>
                      <Card className="execution__content__manifest__status" inverse color={getManifestStatusColor(manifest?.status)}>
                        {manifest?.status}
                      </Card>
                    </Col>
                    <Col md={10}>
                      {manifest?.name}
                    </Col>
                  </Row>
                </ListGroupItem>
                <UncontrolledCollapse toggler={`#coll-${manifest?.id}`} className="execution__content__manifest__collapse">
                  <AceEditor
                    mode="java"
                    theme="github"
                    readOnly={true}
                    value={manifest?.manifest}
                    editorProps={{ $blockScrolling: true }}
                    width="100%"
                    showPrintMargin={false}
                  />
                </UncontrolledCollapse>
              </>
            ))}
          </ListGroup>
        </Container>
      </div>
    </div>
  )
}

export default Execution
