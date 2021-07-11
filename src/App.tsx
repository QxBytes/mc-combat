import React from 'react';
import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import './cc.scss';
import { DamageCalculator } from './features/calculator/DamageCalculator';
import { SetupContainer } from './features/setups/SetupContainer';
import { DragContainer } from './features/simulator/DragContainer';
import { Simulator } from './features/simulator/Simulator';
import { SimulatorHeader } from './features/simulator/SimulatorHeader';
function App() {
  return (
    <div className="App">
      <Container fluid className="main-container">
        <Navbar bg="danger" expand="lg">
          <Nav className="mr-auto">
            Minecraft Combat Simulator
          </Nav>
        </Navbar>
        <Row>
        <Col sm={12} md={12} lg={12} xl={5}>
          <SetupContainer />
        </Col>
        <Col sm={12} md={12} lg={12} xl={7}>
          <DamageCalculator />
        </Col>
        </Row>
        <Row>
          <Col>
            <SimulatorHeader/>
          </Col>
        </Row>
        <Row className="">
          <Col sm={12} md={12} lg={4} className="overflow-scroll h-simulator">
          <DndProvider backend={HTML5Backend}>
            <DragContainer />
          </DndProvider>
          </Col>
          <Col sm={12} md={12} lg={8} className="">
            <Simulator />
          </Col>
        </Row>
      </Container>
      {/*
      <header className="App-header">
        
        <Counter />
        <Active />
      </header>
      */}
    </div>
  );
}

export default App;
