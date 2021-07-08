import React, { useState } from "react";
import { Button, ButtonGroup, Col, Form, Row, Image } from "react-bootstrap";
import NumericInput from "react-numeric-input";
import { fullCharge, getDamage, getDamageEquation, getSeconds, getTicks, percentCharge, preset, toString } from "./weapon";
import { Collapseable, DropInput } from "../item/utility/Parts";
import { defaultWeapon, FIST, makeWeapon, TRIDENT, Weapon, WEAPONS, WEAPON_MATERIALS } from "./weapon";
import { WeaponDamageGraph } from "./WeaponDamageGraph";
import { WeaponGraph } from "./WeaponGraph";
import { ItemBadge } from "../item/setups/EnchantContainer";
import { ENCHANT_ARRAY, getEnchantment, SHARPNESS } from "../item/calculations/enchants";
import { getEffect, setEffect, STRENGTH, WEAKNESS } from "../item/calculations/effects";
import { range, round } from "../item/utility/Utils";


import heart from '../item/images/half_heart_lg.png';
import { useAppDispatch } from "../../app/hooks";
import { selectDamage, setDamage, setDamageTicks, setDamageType } from "../item/activeSlice";
import { Damage, equals } from "../item/calculations/damage";
import { useSelector } from "react-redux";
import Icon from "../item/utility/Icons";
import { SyncSave } from "../item/SyncSave";

const _ = require('lodash');
const nomar = require('nomar');
export function WeaponEditor() {
    const dispatch = useAppDispatch();
    const globalDamage = useSelector(selectDamage);
    const [weapon, setActualWeapon] = useState(defaultWeapon());
    const setWeapon = (w: Weapon) => {
        setActualWeapon(w);
        dispatch(setDamageType(toString(w)));
        dispatch(setDamage(getDamage(w)));
        dispatch(setDamageTicks(w.ticksSinceLast))
    }
    const c = () => {
        return _.cloneDeep(weapon);
    }
    const getDamageObj = (w: Weapon): Damage => {
        return {amount: getDamage(w), ticks: w.ticksSinceLast, type: toString(w)}
    }
    
    return (
        <div className={equals(getDamageObj(weapon), globalDamage) ? "active-calculator" : ""}>
        <Row>
            
        <Col xs={12} lg={6} className="text-left">
            <Row className="text-left">
                <Col>
                <ButtonGroup>
                <DropInput 
                selected={weapon.type}
                inputs={WEAPONS}
                onDropClicked={(val) => {
                    const x = c(); preset(x, val, x.material); setWeapon(x);
                }}
                />
                {
                    weapon.type === TRIDENT ||
                    weapon.type === FIST ? "" :
                    <DropInput 
                    selected={weapon.material}
                    inputs={WEAPON_MATERIALS.get(weapon.type)!}
                    onDropClicked={(val) => {
                        const x = c(); preset(x, x.type, val); setWeapon(x);
                    }}
                    />
                }
                </ButtonGroup>
                <Form.Check custom inline label={"Attempt Critical"} type="checkbox" name="critical"
                    checked={weapon.critical}
                    id={`critical`}
                    onChange={ (e) => {
                        const x = c(); x.critical = !weapon.critical; setWeapon(x);
                    }}
                />
                </Col>
            </Row>
            <Row>
                <Col>
                <span className="p-1"> Wait 
                <NumericInput className="align-middle"  min={0.05} max={20} step={.05} precision={3} 
                        value={getSeconds(weapon.ticksSinceLast)}
                        onChange={(valueAsNumber:(number|null), stringValue:string, el: HTMLInputElement) => {
                        //Poor documentation
                            if (valueAsNumber) {
                                const x = c(); x.ticksSinceLast = getTicks(valueAsNumber); setWeapon(x);
                            }
                        }}
                        format={(num) => num + " s (" + (getTicks(num||0)) + " ticks, " + 
                        percentCharge(weapon) + "%)"}
                />
                before attack
                </span>
                <Button onClick={ () => {
                    const x = c(); x.ticksSinceLast = round(fullCharge(x)); setWeapon(x);}}>
                    max
                </Button>
                </Col>
            </Row>
        </Col>
        <Col xs={12} lg={6} className="text-left">
            <ItemBadge 
                name={SHARPNESS.key}
                value={weapon.sharpness}
                getValidValues={ () => {
                    return (range(1, SHARPNESS.value+1))}}
                onValueChange={(val) => {
                    const x = c(); x.sharpness = (val); setWeapon(x);
                }}
                onDelete={() => {const x = c(); x.sharpness = (0); setWeapon(x);}}
            />
            <ItemBadge 
                name={STRENGTH.key}
                value={(getEffect(weapon.effects, STRENGTH.key) || {value:0}).value}
                getValidValues={ () => {
                    return (range(1, 3))}}
                onValueChange={(val) => {
                    const x = c(); setEffect(x.effects, STRENGTH.key, (val)); setWeapon(x);
                }}
                onDelete={() => {const x = c(); setEffect(x.effects, STRENGTH.key, (0)); setWeapon(x)}}
            />
            <ItemBadge 
                name={WEAKNESS.key}
                value={(getEffect(weapon.effects, WEAKNESS.key) || {value:0}).value}
                getValidValues={ () => {
                    return (range(1, 4))}}
                onValueChange={(val) => {
                    const x = c(); setEffect(x.effects, WEAKNESS.key, (val)); setWeapon(x);
                }}
                onDelete={() => {const x = c(); setEffect(x.effects, WEAKNESS.key, (0)); setWeapon(x);}}
            />
            
        </Col>
        </Row>
        <Row>
            <Col className="vc">
                <span className="p-1">DPS: {round(getDamage(weapon) / getSeconds(weapon.ticksSinceLast))}</span>
                {weapon.ticksSinceLast < 10 ? 
                <span>⚠️ Damage triggers 0.5 sec immunity</span>
                : ""}
            </Col>
            <Col className="text-right">
                <SyncSave dmg={getDamageObj(weapon)} />
            </Col>
        </Row>
        <Row>
            <Col>
        <Collapseable
            title={"Weapon Damage Graphs"}
            inner={(
                <Row>
                <WeaponGraph 
                weapon={weapon}
                />
                <WeaponDamageGraph 
                weapon={weapon}
                />
                </Row>
            )}
            className={"w-100"}
        />
        </Col>
        </Row>
        </div>
    )
}

