import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { useAppSelector } from "../../app/hooks";
import { WeaponEditor } from "../weapon/WeaponEditor";
import { selectDamage } from "./activeSlice";
import { Damage } from "./calculations/damage";
import { DamageGraph } from "./DamageGraph";
import { DamageSummaryTable } from "./DamageSummary";
import { Explosion } from "./explosion/Explosion";
import { Fall } from "./fall/Fall";
import { GeneralCalculator } from "./GeneralCalculator";
import { Collapseable } from "./utility/Parts";



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
            title={"Explosion damage calculator"}
            inner ={(
                <Explosion />
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
            defaultOpen
            title={"Specified Damage vs. Setups"}
            className="w-100"
            inner={
                    <DamageSummaryTable />
            }
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

