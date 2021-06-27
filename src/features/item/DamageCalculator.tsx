import { Col, Row, Image } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectDamage, selectEntity, setDamage, setDamageType } from "./activeSlice";
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
import NumericInput from 'react-numeric-input';

import heart from './images/half_heart_lg.png';


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
    const dispatch = useAppDispatch();
    return (
        <div className="container-top">
            <Row noGutters>
            <Col>
            <h3 className="text-left bottom-border p-1">Damage Calculations</h3>
            </Col>
            </Row>
            <Row>
                <Col>
                <Image className="m-1" src={heart} width={18} height={18}></Image>
                <div className="vc d-inline-block">
                    <NumericInput  min={1} max={10000} step={1} 
                    precision={2} value={damage.amount}
                    onChange={(valueAsNumber:(number|null), stringValue:string, el: HTMLInputElement) => {
                    //Poor documentation
                        if (valueAsNumber) {
                            dispatch(setDamage(valueAsNumber));
                        }
                    }}
                />
                </div>
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
            <Row >
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
        className={hover || props.dmg.type === damage.type ? "highlighted fade-transition" : "fade-transition"}
        onClick={ () => dispatch(setDamageType(props.dmg.type))}
        >
                
            <h4>{props.dmg.type}</h4>
            <h6>Resistance {round(100- ((takeDamage(props.dmg, entity))*100 / props.dmg.amount))}%</h6>
            <h6>{round(takeDamage(props.dmg, entity))}</h6>
            <h6>EPF {getSetEPF(entity.armor, props.dmg.type)}</h6>
        </Col>
    );
}