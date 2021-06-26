import { Col, Row } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectDamage, selectEntity, setDamageType } from "./activeSlice";
import { getSetEPF, setType } from "./armor";
import { Entity } from "./entity";
import { takeDamage } from "./maths";
import * as d from './damageTypes';
import { Damage } from "./damage";
import { round } from "./Utils";
import React, { useState } from "react";

import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import { DamageGraph } from "./DamageGraph";


interface DamageInputType {
    
}
export function DamageInput(props: DamageInputType) {
    const [value, setValue] = useState(0);
    return (
        <RangeSlider
            value={value}
            onChange={(e : React.ChangeEvent<HTMLInputElement>) => setValue(parseInt(e.target.value))}
        />
    )
}

interface DamageCalculatorType {
    
}
export function DamageCalculator(props : DamageCalculatorType) {
    const entity : Entity = useAppSelector(selectEntity);
    const damage : Damage = useAppSelector(selectDamage);
    
    return (
        <div className="container-top">
            <Row noGutters className="">
            <Col>
            <h3 className="text-left bottom-border p-1">Damage Calculations</h3>
            </Col>
            </Row>
            <Row className="damage-display-container">
                <DamageDisplay dmg={{amount: damage.amount, type: d.MELEE}}></DamageDisplay>
                <DamageDisplay dmg={{amount: damage.amount, type: d.FALL}}></DamageDisplay>
                <DamageDisplay dmg={{amount: damage.amount, type: d.EXPLOSION}}></DamageDisplay>
                <DamageDisplay dmg={{amount: damage.amount, type: d.FIRE}}></DamageDisplay>
                <DamageDisplay dmg={{amount: damage.amount, type: d.PROJECTILE}}></DamageDisplay>
                <DamageDisplay dmg={{amount: damage.amount, type: d.MAGIC}}></DamageDisplay>
            </Row>
            <Row>
                <DamageGraph />
            </Row>
        </div>
    );
}
interface DamageDisplayType {
    dmg: Damage
}
export function DamageDisplay(props: DamageDisplayType) {
    const entity : Entity = useAppSelector(selectEntity);
    const damage : Damage = useAppSelector(selectDamage);
    const dispatch = useAppDispatch();
    const [hover, setHover] = useState(false);
    return (
        <Col onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}
        className={hover || props.dmg.type === damage.type ? "highlighted" : ""}
        onClick={ () => dispatch(setDamageType(props.dmg.type))}
        >
                
            <h4>{props.dmg.type}</h4>
            <h6>Resistance {round(100- ((takeDamage(props.dmg, entity))*100 / props.dmg.amount))}%</h6>
            <h6>{round(takeDamage(props.dmg, entity))}</h6>
            <h6>EPF {getSetEPF(entity.armor, props.dmg.type)}</h6>
        </Col>
    );
}