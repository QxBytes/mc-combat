import React, { useState } from "react";
import { Button, ButtonGroup, Col, Form, Row, Image } from "react-bootstrap";
import NumericInput from "react-numeric-input";
import { getDamage, getDamageEquation, getSeconds, getTicks, preset, toString } from "./weapon";
import { DropInput } from "../item/Parts";
import { defaultWeapon, FIST, makeWeapon, TRIDENT, Weapon, WEAPONS, WEAPON_MATERIALS } from "./weapon";
import { WeaponDamageGraph } from "./WeaponDamageGraph";
import { WeaponGraph } from "./WeaponGraph";
import { ItemBadge } from "../item/EnchantContainer";
import { ENCHANT_ARRAY, getEnchantment, SHARPNESS } from "../item/enchants";
import { getEffect, setEffect, STRENGTH, WEAKNESS } from "../item/effects";
import { range, round } from "../item/Utils";


import heart from '../item/images/half_heart_lg.png';
import { useAppDispatch } from "../../app/hooks";
import { setDamage, setDamageTicks, setDamageType } from "../item/activeSlice";

const _ = require('lodash');
const nomar = require('nomar');
export function WeaponEditor() {
    const dispatch = useAppDispatch();
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
    return (
        <React.Fragment>
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
            <span>Wait 
            <NumericInput  min={0} max={20} step={.05} precision={2} 
                    value={getSeconds(weapon.ticksSinceLast)}
                    onChange={(valueAsNumber:(number|null), stringValue:string, el: HTMLInputElement) => {
                    //Poor documentation
                        if (valueAsNumber) {
                            const x = c(); x.ticksSinceLast = valueAsNumber*20; setWeapon(x);
                        }
                    }}
                    format={(num) => num + " sec (" + (getTicks(num||0)) + " ticks)"}
            />
             before attack
            </span>
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
        </Row>
        <Row>
        <WeaponGraph 
                weapon={weapon}
                />
        <WeaponDamageGraph 
        weapon={weapon}
        />
        </Row>
        </React.Fragment>
    )
}

