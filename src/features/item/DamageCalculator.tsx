import { Col, Row } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectEntity } from "./activeSlice";
import { setType } from "./armor";
import { Entity } from "./entity";
import { takeDamage } from "./maths";

interface DamageCalculatorType {
    
}
export function DamageCalculator(props : DamageCalculatorType) {
    const entity : Entity = useAppSelector(selectEntity);
    const dispatch = useAppDispatch();
    return (
        <Row>
            <Col>
                <h3></h3>
                <ul>
                    <li>{takeDamage({amount: 25, type: "melee"}, entity)}</li>
                    <li>{takeDamage({amount: 25, type: "fall"}, entity)}</li>
                </ul>
            </Col>

        </Row>
    );
}