import { Row, Col, Button } from "react-bootstrap";
const Scroll   = require('react-scroll');
const Element  = Scroll.Element;
const scroller = Scroll.scroller;
export function SimulatorHeader() {
    return (
        <div className="container-top text-left">
            <Row noGutters>
            <Col>
            <Element name="simulator-link"></Element>
            <h3 className="text-left bottom-border p-1">Simulator</h3>
            <Button onClick={() => {
                scroller.scrollTo('damage-link', {
                    duration: 1000,
                    smooth: true})
            }}>Jump to Damage Editor</Button>
            <Button onClick={() => {
                scroller.scrollTo('setup-link', {
                    duration: 1000,
                    smooth: true})
            }}>Jump to Setups</Button>
            </Col>
            </Row>
        </div>
    );
}