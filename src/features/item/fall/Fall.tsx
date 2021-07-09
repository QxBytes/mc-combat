import update from "immutability-helper";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import NumericInput from "react-numeric-input";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../app/hooks";
import { selectDamage } from "../activeSlice";
import { equals } from "../calculations/damage";
import { FALL } from "../calculations/damageTypes";
import { SyncSave } from "../SyncSave";
import { sync } from "../utility/Parts";

export function Fall() {
    const dispatch = useAppDispatch();
    const globalDamage = useSelector(selectDamage);
    const [localDamage, setActualDamage] = useState( {amount: 1, type: FALL, ticks: 10} )
    const [height, setHeight] = useState(4);
    const fallDamage = (height: number) : number => {
        setHeight(height);
        return Math.max(0, height - 3);
    }
    const minFallDamage = () => {
        return {amount: Math.max(0,localDamage.amount - 1), ticks: 10, type: FALL };
    }
    return (
        <div className={equals(localDamage, globalDamage) || equals(minFallDamage(), globalDamage)
            ? "active-calculator" : "inactive-calculator"}>
            <Row>
                <Col md={6} lg={8}>
                <span>Fall Height: </span>
                <NumericInput  min={0} max={10000} step={1} 
                    value={height}
                    onChange={(valueAsNumber:(number|null), stringValue:string, el: HTMLInputElement) => {
                        if (valueAsNumber || valueAsNumber === 0) {
                            sync(dispatch, update(localDamage, {amount: {$set: fallDamage(valueAsNumber)}}), setActualDamage);
                        }
                    }}
                />
                <span> *For heights less than 23, use max</span>
                </Col >
                <Col md={6} lg={4} className="text-right">
                    <span>Max</span>
                    <SyncSave dmg={localDamage}/>
                </Col>
            </Row>
            <Row>
                <Col md={6} lg={8}>
                </Col>
                <Col md={6} lg={4} className="text-right">
                    <span>Min</span>
                    <SyncSave dmg={minFallDamage()} />
                </Col>
            </Row>
        </div>
    );
}