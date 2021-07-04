import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import './cc.scss';
import { Active } from './features/item/Active';
import { ArmorSlot } from './features/item/ArmorSlot';
import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { DamageCalculator } from './features/item/DamageCalculator';
import { EntityContainer } from './features/item/EntityContainer';
import { SetupContainer } from './features/item/SetupContainer';
import { DragContainer } from './features/simulator/DragContainer';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Simulator } from './features/simulator/Simulator';
import { SimulatorHeader } from './features/simulator/SimulatorHeader';

function App() {
  return (
    <div className="App">
      <Container fluid className="main-container">
        <Navbar bg="danger" expand="lg">
          <Nav className="mr-auto">
            Ok
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
          <Col sm={12} md={12} lg={4} className="overflow-scroll h-100vh">
          <DndProvider backend={HTML5Backend}>
            <DragContainer />
          </DndProvider>
          </Col>
          <Col sm={12} md={12} lg={8} className="overflow-scroll h-100vh">
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
