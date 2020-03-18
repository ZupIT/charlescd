import React, { useState } from 'react'
import moment from 'moment'
import classnames from 'classnames';
import './style.css'
import { Navbar, Container, Row, Col, Card, CardHeader, CardBody, Badge, ListGroup, ListGroupItem, UncontrolledCollapse, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { useParams, useRouteData, Link } from 'react-suspense-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AceEditor from "react-ace";
import { getDuration } from '../Executions/helper'
import YAML from 'json2yaml'

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import { getManifestStatusColor } from './helper'

const Execution = () => {
  const [activeTab, setActiveTab] = useState('1');
  const {id} = useParams()
  const { result } = useRouteData()

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

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
              <Col md={12}><strong>Helm URL: </strong>{result?.helmUrl}</Col>
            </div>
          </Row>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => { toggle('1'); }}
              >
                Deployed <Badge pill>{result?.deployedComponents ? result?.deployedComponents.length : 0}</Badge>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => { toggle('2'); }}
              >
                Undeployed <Badge pill>{result?.undeployedComponents ? result?.undeployedComponents?.length : 0}</Badge>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '3' })}
                onClick={() => { toggle('3'); }}
              >
                Istio Components <Badge pill>{result?.istioComponents ? result?.istioComponents?.length : 0}</Badge>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              {result?.deployedComponents?.map(component => (
                <Card>
                  <CardHeader>{component?.name}</CardHeader>
                  <CardBody>
                    <ListGroup className="execution__content__manifests">
                      {component?.manifests?.map(manifest => (
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
              
            </TabPane>
            <TabPane tabId="3">
              {result?.istioComponents?.map(component => (
                <Card>
                  <CardHeader>{component?.name}</CardHeader>
                  <CardBody>
                    <ListGroup className="execution__content__manifests">
                      {component?.manifests?.map(manifest => (
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
