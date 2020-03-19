import React, { Suspense } from 'react'
import { Navbar, NavbarBrand, Container } from 'reactstrap';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-suspense-router';
import { fetchExecutions } from '../Executions/executions.data';
import './style.css'
import { fetchExecution } from '../Execution/execution.data';

const Executions = React.lazy(() => import('../Executions'))
const Execution = React.lazy(() => import('../Execution'))


const Main = () => {
  return (
    <div className="main">
      <BrowserRouter>
          <Navbar className="main__navbar">
            <Container>
              <NavbarBrand>Octopipe</NavbarBrand>
            </Container>
          </Navbar>
          <Suspense fallback="">
            <Routes>
              <Route exact path="/" element={<Executions />} fetchData={fetchExecutions} />
              <Route path="/:id" element={<Execution />} fetchData={fetchExecution} />
            </Routes>
          </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default Main
