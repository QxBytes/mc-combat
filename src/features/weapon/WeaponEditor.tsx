import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import NumericInput from "react-numeric-input";
import { preset } from "./weapon";
import { DropInput } from "../item/Parts";
import { defaultWeapon, FIST, makeWeapon, TRIDENT, Weapon, WEAPONS, WEAPON_MATERIALS } from "./weapon";
import { WeaponDamageGraph } from "./WeaponDamageGraph";
import { WeaponGraph } from "./WeaponGraph";
import { ItemBadge } from "../item/EnchantContainer";
import { ENCHANT_ARRAY, getEnchantment, SHARPNESS } from "../item/enchants";
import { getEffect, setEffect, STRENGTH, WEAKNESS } from "../item/effects";
import { range } from "../item/Utils";
const _ = require('lodash');
const nomar = require('nomar');
export function WeaponEditor() {
    
    const [weapon, setWeapon] = useState(defaultWeapon());
    const c = () => {
        return _.cloneDeep(weapon);
    }
    return (
        <React.Fragment>
        <Row>
            
        <Col xs={12}>
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
            <Form.Check custom inline label={"Attempt Critical"} type="checkbox" name="critical"
                checked={weapon.critical}
                id={`critical`}
                onChange={ (e) => {
                    const x = c(); x.critical = !weapon.critical; setWeapon(x);
                }}
            />
            <NumericInput  min={1} max={400} step={1} 
                    value={weapon.ticksSinceLast}
                    onChange={(valueAsNumber:(number|null), stringValue:string, el: HTMLInputElement) => {
                    //Poor documentation
                        if (valueAsNumber) {
                            const x = c(); x.ticksSinceLast = valueAsNumber; setWeapon(x);
                        }
                    }}
            />
            
        </Col>
        <Col>
            <ItemBadge 
                name={SHARPNESS.key}
                value={weapon.sharpness}
                getValidValues={ () => {
                    return nomar(range(1, SHARPNESS.value+1))}}
                onValueChange={(val) => {
                    const x = c(); x.sharpness = (val); setWeapon(x);
                }}
                onDelete={() => {}}
            />
            <ItemBadge 
                name={STRENGTH}
                value={(getEffect(weapon.effects, STRENGTH) || {value:0}).value}
                getValidValues={ () => {
                    return nomar(range(1, 3))}}
                onValueChange={(val) => {
                    const x = c(); setEffect(x.effects, STRENGTH, (val)); setWeapon(x);
                }}
                onDelete={() => {}}
            />
            <ItemBadge 
                name={WEAKNESS}
                value={(getEffect(weapon.effects, WEAKNESS) || {value:0}).value}
                getValidValues={ () => {
                    return nomar(range(1, 4))}}
                onValueChange={(val) => {
                    const x = c(); setEffect(x.effects, WEAKNESS, (val)); setWeapon(x);
                }}
                onDelete={() => {}}
            />
        </Col>
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

