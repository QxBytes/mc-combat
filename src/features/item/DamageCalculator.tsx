import { Col, Row, Image } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectDamage, setDamage } from "./activeSlice";
import { Damage } from "./damage";
import React, { useState } from "react";

import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import { DamageGraph } from "./DamageGraph";
import NumericInput from 'react-numeric-input';

import heart from './images/half_heart_lg.png';
import { DamageSummaryTable } from "./DamageSummary";
import { WeaponGraph } from "../weapon/WeaponGraph";
import { makeWeapon } from "../weapon/weapon";
import { WeaponDamageGraph } from "../weapon/WeaponDamageGraph";
import { WeaponEditor } from "../weapon/WeaponEditor";


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
            <Row className="damage-display-container" noGutters>
                <DamageSummaryTable />
            </Row>
            <WeaponEditor />

            <Row >
                <DamageGraph />
            </Row>
        </div>
    );
}

