import React, { Suspense } from 'react'
import { Navbar, NavbarBrand, Container } from 'reactstrap';
import {
  BrowserRouter,
  Route,
} from 'react-router-dom';
import './style.css'

const Executions = React.lazy(() => import('../Executions'))
const Execution = React.lazy(() => import('../Execution'))


const Main = () => {
  return (
    <div className="main">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Navbar className="main__navbar">
            <Container>
              <NavbarBrand>Octopipe</NavbarBrand>
            </Container>
          </Navbar>
          <Suspense fallback="">
            <Route exact path="/" component={Executions} />
            <Route path="/:id" component={Execution} />
          </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default Main
