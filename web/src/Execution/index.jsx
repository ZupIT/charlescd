import React, { useState, useEffect } from 'react'
import moment from 'moment'
import classnames from 'classnames';
import './style.css'
import { Navbar, Container, Row, Col, Card, CardHeader, CardBody, Badge, ListGroup, ListGroupItem, UncontrolledCollapse, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AceEditor from "react-ace";
import { getDuration } from '../Executions/helper'
import YAML from 'json2yaml'

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import { getManifestStatusColor } from './helper'
import { Link, useParams } from 'react-router-dom';

const basePath = process.env.REACT_APP_API_URI;

const Execution = () => {
  const [execution, setExecution] = useState({})
  const [activeTab, setActiveTab] = useState('1');
  const {id} = useParams()

  useEffect(() => {
    const getExecution = () => fetch(`${basePath}/api/v1/executions/${id}`)
      .then(res => res.json())
      .then(res => setExecution(res))

    getExecution()
  }, [id])

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  return (
    <div className="execution">
      <Navbar className="execution__navbar">
        <Container>
          <Link to="/">{execution?.name}</Link>
        </Container>
      </Navbar>
      <div className="execution__content">
        <Container>
          <Row>
            <Col md={12}>
              <Card className="execution__content__basic">
                <div><FontAwesomeIcon icon="user" /> {execution?.author}</div>
                <div>
                  <FontAwesomeIcon icon="calendar-day" /> {moment.utc(execution?.startTime).format("DD/MM/YYYY")}{'  '}
                  <FontAwesomeIcon icon="clock" /> {moment.utc(execution?.startTime).format("HH:mm:ss")}
                </div>
                <div>
                  <FontAwesomeIcon icon="calendar-day" /> {moment.utc(execution?.finishTime).format("DD/MM/YYYY")}{'  '}
                  <FontAwesomeIcon icon="clock" /> {moment.utc(execution?.finishTime).format("HH:mm:ss")}
                </div>
                <div>
                  <FontAwesomeIcon icon="clock" /> {getDuration(execution?.startTime, execution?.finishTime)}
                </div>
              </Card>
            </Col>
            <div className="execution__content__resume">
              <Col md={12}><strong>Name: </strong>{execution?.name}</Col>
              <Col md={12}><strong>Namespace: </strong>{execution?.namespace}</Col>
              <Col md={12}><strong>Webhook: </strong>{execution?.webhook}</Col>
              <Col md={12}><strong>Helm URL: </strong>{execution?.helmUrl}</Col>
            </div>
          </Row>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => { toggle('1'); }}
              >
                Deployed <Badge pill>{execution?.deployedVersions ? execution?.deployedVersions.length : 0}</Badge>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => { toggle('2'); }}
              >
                Undeployed <Badge pill>{execution?.undeployedVersions ? execution?.undeployedVersions?.length : 0}</Badge>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '3' })}
                onClick={() => { toggle('3'); }}
              >
                Istio Components <Badge pill>{execution?.istioComponents ? execution?.istioComponents?.length : 0}</Badge>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              {execution?.deployedVersions?.map(version => (
                <Card>
                  <CardHeader>{version?.name}</CardHeader>
                  <CardBody>
                    <ListGroup className="execution__content__manifests">
                      {version?.manifests?.map(manifest => (
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
                              value={YAML.stringify(JSON.parse(manifest?.manifest))}
                              editorProps={{ $blockScrolling: true }}
                              width="100%"
                              showPrintMargin={false}
                            />
                          </UncontrolledCollapse>
                        </>
                      ))}
                    </ListGroup>
                  </CardBody>
                </Card>
              ))}
              
              
            </TabPane>
            <TabPane tabId="2">
              <ListGroup>
                {execution?.undeployedVersions?.map(version => (
                  <ListGroupItem>{version}</ListGroupItem>
                ))}
              </ListGroup>
            </TabPane>
            <TabPane tabId="3">
              {execution?.istioComponents?.map(component => (
                <Card>
                  <CardHeader>{component?.name}</CardHeader>
                  <CardBody>
                    <ListGroup className="execution__content__manifests">
                      <>
                        <ListGroupItem className="execution__content__manifest" id={`coll-${component?.id}`}>
                          <Row>
                            <Col md={2}>
                              <Card className="execution__content__manifest__status" inverse color={getManifestStatusColor(component?.status)}>
                                {component?.status}
                              </Card>
                            </Col>
                            <Col md={10}>
                              {component?.name}
                            </Col>
                          </Row>
                        </ListGroupItem>
                        <UncontrolledCollapse toggler={`#coll-${component?.id}`} className="execution__content__manifest__collapse">
                          <AceEditor
                            mode="java"
                            theme="github"
                            readOnly={true}
                            value={YAML.stringify(JSON.parse(component?.manifest))}
                            editorProps={{ $blockScrolling: true }}
                            width="100%"
                            showPrintMargin={false}
                          />
                        </UncontrolledCollapse>
                      </>
                    </ListGroup>
                  </CardBody>
                </Card>
              ))}
            </TabPane>
          </TabContent>
        </Container>
      </div>
    </div>
  )
}

export default Execution
