import { Button, Col, Row } from "react-bootstrap";
import NumericInput from "react-numeric-input";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { saveDamage, selectDamage, setDamage, setDamageTicks, setDamageType } from "./activeSlice";
import { Damage, defaultDamage, equals } from "./calculations/damage";
import { baseDamageType, DAMAGE_ARRAY } from "./calculations/damageTypes";
import { SyncSave } from "./SyncSave";
import EditInPlace from "./utility/EditInPlace";
import { DropInput, HalfHeart, sync } from "./utility/Parts";
import update from 'immutability-helper';
import { copy } from "./calculations/damage";
import { useState } from "react";
import { getSeconds, getTicks } from "../weapon/weapon";
import { useSelector } from "react-redux";

const Scroll   = require('react-scroll');

export function GeneralCalculator() {
    const dispatch = useAppDispatch();
    const globalDamage = useSelector(selectDamage);
    const [localDamage, setDamage] = useState(defaultDamage());

    return (
        <Row noGutters className={equals(localDamage, globalDamage) ? "active-calculator" : ""}>
        <Col md={6} lg={8}>
                <HalfHeart />
                <div className="vc d-inline-block">
                    <NumericInput  min={0} max={10000} step={1} 
                    precision={2} value={localDamage.amount}
                    onChange={(valueAsNumber:(number|null), stringValue:string, el: HTMLInputElement) => {
                    //Poor documentation
                        if (valueAsNumber || valueAsNumber === 0) {
                            sync(dispatch, update(localDamage, {amount: {$set: valueAsNumber}}), setDamage);
                        }
                    }}
                    />
                </div>
                
                <div className="vc d-inline-block">
                    <NumericInput  min={0} max={1000} step={.05} 
                    precision={2} value={getSeconds(localDamage.ticks)}
                    onChange={(valueAsNumber:(number|null), stringValue:string, el: HTMLInputElement) => {
                        if (valueAsNumber || valueAsNumber === 0) {
                            sync(dispatch, update(localDamage, {ticks: {$set: getTicks(valueAsNumber)}}), setDamage);
                        }
                    }}
                    format={(num) => num + " sec (" + (getTicks(num||0)) + " ticks)"}
                    />
                </div>
                <div className="vc d-inline-block">
                <DropInput
                    selected={localDamage.type}
                    inputs={DAMAGE_ARRAY}
                    onDropClicked={ (val) => {
                        sync(dispatch, update(localDamage, {type: {$set: val}}), setDamage);
                    }}
                />
                </div>
                <EditInPlace
                    display={localDamage.type}
                    save={(val: string) => {
                        sync(dispatch, update(localDamage, {type: {$set: val}}), setDamage);
                    }}
                />
                {localDamage.ticks < 10 ? 
                <span className="p-1">⚠️ Damage triggers 0.5 sec immunity</span>
                : ""}
                
        </Col>
        <Col md={6} lg={4} className="text-right">
        <div className="no-wrap d-inline-block vc">
            {/* Hey we copied the damage object so things wouldn't snowball */}
        <SyncSave dmg={copy(localDamage)} />
        </div>
        </Col>
        </Row>
    )
}