import update from 'immutability-helper';
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import NumericInput from "react-numeric-input";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/hooks";
import { getSeconds, getTicks } from "../weapon/weapon";
import { selectDamage } from "./activeSlice";
import { copy, defaultDamage, equals } from "./calculations/damage";
import { DAMAGE_ARRAY } from "./calculations/damageTypes";
import { SyncSave } from "./SyncSave";
import EditInPlace from "./utility/EditInPlace";
import { DropInput, HalfHeart, sync } from "./utility/Parts";

export function GeneralCalculator() {
    const dispatch = useAppDispatch();
    const globalDamage = useSelector(selectDamage);
    const [localDamage, setDamage] = useState(defaultDamage());

    return (
        <Row noGutters className={equals(localDamage, globalDamage) ? "active-calculator" : "inactive-calculator"}>
        <Col md={6} lg={8}>
                <HalfHeart />
                <div className="vc d-inline-block">
                    <NumericInput  min={0} max={10000} step={1} 
                    precision={2} value={localDamage.amount}
                    onChange={(valueAsNumber:(number|null)) => {
                        sync(dispatch, update(localDamage, {amount: {$set: valueAsNumber as number}}), setDamage);
                    }}
                    />
                </div>
                
                <div className="vc d-inline-block">
                    <NumericInput  min={0} max={1000} step={.05} 
                    precision={2} value={getSeconds(localDamage.ticks)}
                    onChange={(valueAsNumber:(number|null)) => {
                        sync(dispatch, update(localDamage, {ticks: {$set: getTicks(valueAsNumber as number)}}), setDamage);
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
                <span className="p-1 no-wrap">⚠️ Damage triggers 0.5 sec immunity</span>
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