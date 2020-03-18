import React, { useEffect, useCallback } from 'react'
import { Table, Navbar, Container, Input, Card } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css'
import { useRouteData, useNavigate } from 'react-suspense-router'
import { getDuration, formatStartTime, getStatusColor } from './helper'

const Executions = () => {
  const { result } = useRouteData()
  const history = useNavigate()

  const handleClick = useCallback((id) => {
    history(`/${id}`)
  })

  const renderStatus = (status) => (
    <Card className="execution__status" inverse color={getStatusColor(status)}>
      {status}
    </Card>
  )

  return (
    <div className="executions">
      <Navbar className="executions__navbar">
        <Container>
          <div className="executions__navbar__content">
            <FontAwesomeIcon icon="search" color="white" />
            <Input
              className="executions__navbar__content__search"
              placeholder="Search..."
            />
          </div>
        </Container>
      </Navbar>
      <Container>
        <Table hover className="executions__table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Name</th>
              <th>Duration</th>
              <th>Start</th>
            </tr>
          </thead>
          <tbody>
            {result?.map(item => (
              <tr key={item?.id} onClick={() => handleClick(item?.id)}>
                <td>{renderStatus(item?.status)}</td>
                <td>{item?.name}</td>
                <td><FontAwesomeIcon icon="clock" /> {getDuration(item?.startTime, item?.finishTime)}</td>
                <td><FontAwesomeIcon icon="play-circle" /> {formatStartTime(item?.startTime)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  )
}

export default Executions
