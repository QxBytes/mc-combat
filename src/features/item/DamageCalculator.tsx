import { Col, Row, Image, Button } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { saveDamage, selectDamage, setDamage, setDamageType } from "./activeSlice";
import { Damage } from "./damage";
import React, { useState } from "react";

import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import { DamageGraph } from "./DamageGraph";
import NumericInput from 'react-numeric-input';

import { DamageSummaryTable } from "./DamageSummary";
import { WeaponEditor } from "../weapon/WeaponEditor";
import { Collapseable, HalfHeart } from "./Parts";
import EditInPlace from "./EditInPlace";
import { baseDamageType } from "./damageTypes";
import Icon from "./Icons";


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
        <div className="container-top text-left">
            <Row noGutters>
            <Col>
            <h3 className="text-left bottom-border p-1">Damage Calculations</h3>
            </Col>
            </Row>
            <Row>
                <Col>
                <HalfHeart />
                <div className="vc d-inline-block">
                    <NumericInput  min={1} max={10000} step={1} 
                    precision={2} value={damage.amount}
                    onChange={(valueAsNumber:(number|null), stringValue:string, el: HTMLInputElement) => {
                    //Poor documentation
                        if (valueAsNumber) {
                            dispatch(setDamage(valueAsNumber));
                            dispatch(setDamageType(baseDamageType(damage.type)));
                        }
                    }}
                    />
                </div>
                <EditInPlace
                    display={damage.type}
                    save={(val: string) => {
                        dispatch(setDamageType(val));
                    }}
                />
                <Button onClick={() => dispatch(saveDamage({type: damage.type, amount: damage.amount, ticks: damage.ticks}))}>
                    <Icon val="done" />
                </Button>
                </Col>
            </Row>
            <Row className="damage-display-container" noGutters>
                <DamageSummaryTable />
            </Row>
            <Collapseable 
            title={"Melee damage calculator"}
            inner={(
                <WeaponEditor />
            )}
            className={"w-100"}
            />
            <Collapseable
            title={damage.type + " Damage Graphs"}
            inner={(
                <DamageGraph />
            )}
            className={"w-100"}
            />
        </div>
    );
}

