import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import './cc.scss';
import { Active } from './features/item/Active';
import { ArmorContainer, ArmorSlot } from './features/item/ArmorSlot';
import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { DamageCalculator } from './features/item/DamageCalculator';

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
          <ArmorContainer />
        </Col>
        <Col sm={12} md={12} lg={12} xl={7}>
          <DamageCalculator />
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
