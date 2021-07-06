import { Col, Row, Image, Button, ButtonGroup } from "react-bootstrap";
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

const Scroll   = require('react-scroll');
const Element  = Scroll.Element;
const scroller = Scroll.scroller;


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
            <Element name="damage-link"></Element>
            <h3 className="text-left bottom-border p-1">Damage Calculations</h3>
            </Col>
            </Row>
            <Row>
                <Col>
                <HalfHeart />
                <div className="vc d-inline-block">
                    <NumericInput  min={0} max={10000} step={1} 
                    precision={2} value={damage.amount}
                    onChange={(valueAsNumber:(number|null), stringValue:string, el: HTMLInputElement) => {
                    //Poor documentation
                        if (valueAsNumber || valueAsNumber === 0) {
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
                <div className="no-wrap d-inline-block">
                <Button onClick={() => dispatch(saveDamage({type: damage.type, amount: damage.amount, ticks: damage.ticks}))}>
                    Save to Simulator 
                </Button>
                <Button onClick={() => {
                    scroller.scrollTo('simulator-link', {
                        duration: 1000,
                        smooth: true
                    })
                }}>
                    Jump to Simulator
                </Button>
                </div>
                </Col>
            </Row>
            <Row className="damage-display-container" noGutters>
                <DamageSummaryTable />
            </Row>
            <Collapseable 
            defaultOpen
            title={"Weapon damage calculator"}
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

