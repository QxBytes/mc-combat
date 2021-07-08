import { Col, Row, Image, Button, ButtonGroup } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { saveDamage, selectDamage, setDamage, setDamageType } from "./activeSlice";
import { Damage } from "./calculations/damage";
import React, { useState } from "react";

import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import { DamageGraph } from "./DamageGraph";
import NumericInput from 'react-numeric-input';

import { DamageSummaryTable } from "./DamageSummary";
import { WeaponEditor } from "../weapon/WeaponEditor";
import { Collapseable, HalfHeart } from "./utility/Parts";
import EditInPlace from "./utility/EditInPlace";
import { baseDamageType } from "./calculations/damageTypes";
import Icon from "./utility/Icons";
import { GeneralCalculator } from "./GeneralCalculator";
import { Fall } from "./fall/Fall";

const Scroll   = require('react-scroll');
const Element  = Scroll.Element;


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
    return (
        <div className="container-top text-left">
            <Row noGutters>
            <Col>
            <Element name="damage-link"></Element>
            <h3 className="text-left bottom-border p-1">Damage Calculations</h3>
            </Col>
            </Row>
            <Collapseable
                defaultOpen
                title={"Summary"}
                className="w-100"
                inner={
                        <DamageSummaryTable />
                }
            />
            <Collapseable 
                
                title={"General calculator"}
                className={"w-100"}
                inner={
                    <GeneralCalculator />
                }
            />

            <Collapseable 
            
            title={"Weapon damage calculator"}
            inner={(
                <WeaponEditor />
            )}
            className={"w-100"}
            />

            <Collapseable 
            title={"Fall damage calculator"}
            inner ={(
                <Fall />
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

