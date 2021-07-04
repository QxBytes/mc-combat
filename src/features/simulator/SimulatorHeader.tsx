import { Row, Col } from "react-bootstrap";

export function SimulatorHeader() {
    return (
        <div className="container-top text-left">
            <Row noGutters>
            <Col>
            <h3 className="text-left bottom-border p-1">Simulator</h3>
            </Col>
            </Row>
        </div>
    );
}